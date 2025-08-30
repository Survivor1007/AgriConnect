from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    FarmerProductViewSet,
    OrderViewSet,
    WeatherReportViewSet,
    FarmingUpdateViewSet,
    UserSignUpView
)

# Create a router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'products', FarmerProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'weather-reports', WeatherReportViewSet, basename='weather-report')
router.register(r'updates', FarmingUpdateViewSet, basename='update')
router.register(r'weatherreports',WeatherReportViewSet, basename="weatherreport")


# Include router URLs
urlpatterns = [
    path('', include(router.urls)),
    
]
