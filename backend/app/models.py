from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_farmer = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)


class FarmProduct(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)  # e.g. kg, quintals
    unit = models.CharField(max_length=20, default="kg")
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Order(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    product = models.ForeignKey(FarmProduct, on_delete=models.CASCADE, related_name="orders")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ], default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

class WeatherReport(models.Model):
    location = models.CharField(max_length=255)
    report_date = models.DateField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    rainfall = models.FloatField()
    conditions = models.CharField(max_length=100)  # e.g. "Sunny", "Rainy"
    created_at = models.DateTimeField(auto_now_add=True)


class FarmingUpdate(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=[
        ("news", "News"),
        ("technology", "Technology"),
        ("tips", "Tips & Best Practices"),
    ], default="news")
    published_at = models.DateTimeField(auto_now_add=True)


