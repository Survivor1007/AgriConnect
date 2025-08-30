from rest_framework import permissions, viewsets
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import FarmingUpdate,FarmProduct,Order, WeatherReport
from .serializers import UserSerializer,FarmingUpdateSerializer,FarmProductSerializer,OrderSerializer,WeatherReportSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
      queryset = User.objects.all()
      serializer_class = UserSerializer
      permission_classes = [permissions.IsAuthenticated]

      def get_queryset(self):
            return User.objects.filter(id = self.request.user.id)
      

class FarmerProductViewSet(viewsets.ModelViewSet):
      queryset = User.objects.all()
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
        return FarmProduct.objects.filter(available=True)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set buyer to the logged-in user
        serializer.save(buyer=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "is_farmer", False):
            # Farmers see orders for their products
            return Order.objects.filter(product__farmer=user)
        else:
            # Buyers see only their orders
            return Order.objects.filter(buyer=user)


# --------------------------
# Weather Report ViewSet
# --------------------------
class WeatherReportViewSet(viewsets.ReadOnlyModelViewSet):  # read-only
    queryset = WeatherReport.objects.all()
    serializer_class = WeatherReportSerializer
    permission_classes = [permissions.AllowAny]  # anyone can see weather reports


# --------------------------
# Farming Update ViewSet
# --------------------------
class FarmingUpdateViewSet(viewsets.ReadOnlyModelViewSet):  # read-only
    queryset = FarmingUpdate.objects.all()
    serializer_class = FarmingUpdateSerializer
    permission_classes = [permissions.AllowAny]  # anyone can see farming updates