from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import User,Order,FarmProduct,WeatherReport


@admin.register(User)   # instead of admin.site.register(User, CustomUserAdmin)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("username", "email", "is_farmer", "is_buyer", "is_staff", "is_superuser")
    list_filter = ("is_farmer", "is_buyer", "is_staff", "is_superuser")
    search_fields = ("username", "email", "phone_number")
    ordering = ("username",)

    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("is_farmer", "is_buyer", "phone_number", "location")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("is_farmer", "is_buyer", "phone_number", "location")}),
    )


@admin.register(FarmProduct)
class FarmProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price_per_unit", "quantity", "created_at")
    search_fields = ("name",)
    list_filter = ("created_at",)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ( "buyer", "product", "quantity", "status")
    search_fields = ("buyer__username", "product__name")
    list_filter = ("created_at",)


        
@admin.register(WeatherReport)
class WeatherReportAdmin(admin.ModelAdmin):
    model = WeatherReport
    list_display = ("location", "report_date", "temperature","humidity","rainfall","conditions")
    search_fields = ("location", "temperature","humidity")


