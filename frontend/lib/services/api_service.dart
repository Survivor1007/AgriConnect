import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import '../models/product_model.dart';
import '../models/order_model.dart';
import '../models/weather_model.dart';
import '../models/update_model.dart';
import 'auth_service.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final AuthService _authService = AuthService();

  // Products
  Future<List<Product>> getProducts() async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.get(
        Uri.parse('${Constants.baseUrl}/api/products/'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Product.fromJson(json)).toList();
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return getProducts();
      } else {
        throw Exception('Failed to load products: ${response.body}');
      }
    } catch (e) {
      print('Get products error: $e');
      throw Exception('Failed to load products: $e');
    }
  }

  Future<Product> createProduct({
    required String name,
    required String description,
    required int quantity,
    required double pricePerUnit,
    required String unit,
  }) async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.post(
        Uri.parse('${Constants.baseUrl}/api/products/'),
        headers: headers,
        body: jsonEncode({
          'name': name,
          'description': description,
          'quantity': quantity,
          'price_per_unit': pricePerUnit,
          'unit': unit,
        }),
      );

      if (response.statusCode == 201) {
        return Product.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return createProduct(
          name: name,
          description: description,
          quantity: quantity,
          pricePerUnit: pricePerUnit,
          unit: unit,
        );
      } else {
        throw Exception('Failed to create product: ${response.body}');
      }
    } catch (e) {
      print('Create product error: $e');
      throw Exception('Failed to create product: $e');
    }
  }

  // Orders
  Future<List<Order>> getOrders() async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.get(
        Uri.parse('${Constants.baseUrl}/api/orders/'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Order.fromJson(json)).toList();
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return getOrders();
      } else {
        throw Exception('Failed to load orders: ${response.body}');
      }
    } catch (e) {
      print('Get orders error: $e');
      throw Exception('Failed to load orders: $e');
    }
  }

  Future<Order> createOrder({
    required int productId,
    required int quantity,
    required double totalPrice,
  }) async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.post(
        Uri.parse('${Constants.baseUrl}/api/orders/'),
        headers: headers,
        body: jsonEncode({
          'product_id': productId,
          'quantity': quantity,
          'total_price': totalPrice,
        }),
      );

      if (response.statusCode == 201) {
        return Order.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return createOrder(
          productId: productId,
          quantity: quantity,
          totalPrice: totalPrice,
        );
      } else {
        throw Exception('Failed to create order: ${response.body}');
      }
    } catch (e) {
      print('Create order error: $e');
      throw Exception('Failed to create order: $e');
    }
  }

  // Weather Reports
  Future<List<WeatherReport>> getWeatherReports() async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.get(
        Uri.parse('${Constants.baseUrl}/api/weather-reports/'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => WeatherReport.fromJson(json)).toList();
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return getWeatherReports();
      } else {
        throw Exception('Failed to load weather reports: ${response.body}');
      }
    } catch (e) {
      print('Get weather reports error: $e');
      throw Exception('Failed to load weather reports: $e');
    }
  }

  Future<WeatherReport> createWeatherReport({
    required String location,
  }) async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.post(
        Uri.parse('${Constants.baseUrl}/api/weather-reports/'),
        headers: headers,
        body: jsonEncode({
          'location': location,
        }),
      );

      if (response.statusCode == 201) {
        return WeatherReport.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return createWeatherReport(location: location);
      } else {
        throw Exception('Failed to create weather report: ${response.body}');
      }
    } catch (e) {
      print('Create weather report error: $e');
      throw Exception('Failed to create weather report: $e');
    }
  }

  // Updates
  Future<List<Update>> getUpdates() async {
    try {
      final headers = await _authService.getAuthHeaders();
      final response = await http.get(
        Uri.parse('${Constants.baseUrl}/api/updates/'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Update.fromJson(json)).toList();
      } else if (response.statusCode == 401) {
        await _authService.refreshTokens();
        return getUpdates();
      } else {
        throw Exception('Failed to load updates: ${response.body}');
      }
    } catch (e) {
      print('Get updates error: $e');
      throw Exception('Failed to load updates: $e');
    }
  }
}