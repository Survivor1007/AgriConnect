from rest_framework import permissions, viewsets, generics,status,serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import FarmingUpdate,FarmProduct,Order, WeatherReport
from .serializers import UserSerializer,FarmingUpdateSerializer,FarmProductSerializer,OrderSerializer,WeatherReportSerializer,SignUpSerializer
from django.conf import settings
import requests
from django.utils import timezone
from rest_framework.views import APIView
import openai

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
      queryset = User.objects.all()
      serializer_class = UserSerializer
      permission_classes = [permissions.IsAuthenticated]

      def get_queryset(self):
            return User.objects.filter(id = self.request.user.id)

      @action(detail=False, methods=["get"])
      def dashboard(self, request):
        user = request.user
        product_count = FarmProduct.objects.filter(farmer=user).count()
        order_count = Order.objects.filter(buyer=user).count()

        return Response({
            "username": user.username,
            "email": user.email,
            "is_farmer": getattr(user, "is_farmer", False),
            "is_buyer": getattr(user, "is_buyer", False),
            "products_count": product_count,
            "orders_count": order_count,
        })
      

class FarmerProductViewSet(viewsets.ModelViewSet):
      queryset = FarmProduct.objects.all()
      serializer_class = FarmProductSerializer
      permission_classes = [permissions.IsAuthenticated]

      def perform_create(self, serializer):
        # Automatically set farmer to the logged-in user
        serializer.save(farmer=self.request.user)

      def get_queryset(self):
        # If farmer → show only their products
        # If buyer → show all available products
        user = self.request.user
        if getattr(user, "is_farmer", False):
            return FarmProduct.objects.filter(farmer=user)
        if getattr(user, "is_buyer", False):
            return FarmProduct.objects.filter(
                available=True,
                farmer__location=user.location  # ✅ filter by farmer’s location
            )

        return FarmProduct.objects.filter(available=True)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "is_farmer", False):
            # Show orders of farmer’s products
            return Order.objects.filter(product__farmer=user)
        return Order.objects.filter(buyer=user)

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        if quantity > product.quantity:
            raise serializers.ValidationError(
                {"quantity": f"Only {product.quantity} {product.unit} available"}
            )

        product.quantity -= quantity
        product.save()

        serializer.save(
            buyer=self.request.user,
            total_price=quantity * product.price_per_unit
        )

# --------------------------
# Weather Report ViewSet
# --------------------------
class WeatherReportViewSet(viewsets.ReadOnlyModelViewSet):  # read-only
    queryset = WeatherReport.objects.all()
    serializer_class = WeatherReportSerializer
    permission_classes = [permissions.AllowAny]  # anyone can see weather reports

    @action(detail=False, methods=["post"])
    def fetch(self, request):
        """Fetch weather from OpenWeather API and store it."""
        location = request.data.get("location")
        if not location:
            return Response({"error": "Location is required"}, status=status.HTTP_400_BAD_REQUEST)

        api_key = settings.OPENWEATHER_API_KEY
        url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"

        try:
            resp = requests.get(url)
            data = resp.json()

            if resp.status_code != 200:
                return Response(data, status=resp.status_code)

            # Extract values
            report = WeatherReport.objects.create(
                location=location,
                report_date=timezone.now().date().isoformat(),  # UNIX timestamp, we’ll convert below
                temperature=data["main"]["temp"],
                humidity=data["main"]["humidity"],
                rainfall=data.get("rain", {}).get("1h", 0.0),
                conditions=data["weather"][0]["description"]
            )

            serializer = WeatherReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# --------------------------
# Farming Update ViewSet
# --------------------------
class FarmingUpdateViewSet(viewsets.ReadOnlyModelViewSet):  # read-only
    queryset = FarmingUpdate.objects.all()
    serializer_class = FarmingUpdateSerializer
    permission_classes = [permissions.AllowAny]  # anyone can see farming updates


class UserSignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.save()


        refresh = RefreshToken.for_user(user)

        return Response({
            "user" : serializer.data,
            "refresh" : str(refresh),
            "access" : str(refresh.access_token)

        },status=status.HTTP_201_CREATED

        )
    

class AskAIView(APIView):
    permission_classes = [permissions.AllowAny]  # allow all, or change to IsAuthenticated if needed

    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call OpenAI API
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # lightweight + fast
                messages=[
                    {"role": "system", "content": "You are AgriConnect AI, helping farmers with agriculture-related queries."},
                    {"role": "user", "content": question},
                ],
                max_tokens=300
            )

            answer = response.choices[0].message.content

            return Response({"question": question, "answer": answer}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)