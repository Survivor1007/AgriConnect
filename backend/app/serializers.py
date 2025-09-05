from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FarmProduct, Order, WeatherReport, FarmingUpdate

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
      class Meta :
            model = User
            fields = [
                  "id",
                  "username",
                  "email",
                  "is_farmer",
                  "is_buyer",
                  "phone_number",
                  "location"

            ]

class FarmProductSerializer(serializers.ModelSerializer):
    farmer = UserSerializer(read_only=True)  # nested farmer info

    class Meta:
        model = FarmProduct
        fields = [
            "id",
            "farmer",
            "name",
            "description",
            "quantity",
            "unit",
            "price_per_unit",
            "available",
            "created_at",
        ]


# --------------------------
# Order Serializer
# --------------------------
class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    product = FarmProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=FarmProduct.objects.all(),
        source="product",
        write_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "buyer",
            "product",
            "product_id",   # write-only field for creating orders
            "quantity",
            "total_price",
            "status",
            "created_at",
        ]
        read_only_fields = ["total_price", "status", "created_at"]

    def create(self, validated_data):
        product = validated_data["product"]
        quantity = validated_data["quantity"]

        total_price = product.price_per_unit * quantity
        order = Order.objects.create(
            buyer=self.context["request"].user,
            product=product,
            quantity=quantity,
            total_price=total_price,
            status="pending"
        )

        # reduce product stock
        product.quantity -= quantity
        product.save()

        return order
    


# --------------------------
# Weather Report Serializer
# --------------------------
class WeatherReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherReport
        fields = [
            "id",
            "location",
            "report_date",
            "temperature",
            "humidity",
            "rainfall",
            "conditions",
            "created_at",
        ]


# --------------------------
# Farming Update Serializer
# --------------------------
class FarmingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmingUpdate
        fields = [
            "id",
            "title",
            "content",
            "category",
            "published_at",
        ]


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = [
            "username" ,"email", "password",
            "phone_number", "location",
            "is_farmer","is_buyer",
        ]
    
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user