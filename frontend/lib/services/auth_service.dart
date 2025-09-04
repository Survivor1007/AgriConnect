import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';
import '../models/user_model.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  String? _accessToken;
  String? _refreshToken;
  User? _currentUser;

  User? get currentUser => _currentUser;
  String? get accessToken => _accessToken;

  Future<bool> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.baseUrl}/api/token/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _accessToken = data['access'];
        _refreshToken = data['refresh'];
        
        await _saveTokens();
        await _loadUserProfile();
        
        return true;
      } else {
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      print('Login error: $e');
      throw Exception('Login failed: $e');
    }
  }

  Future<bool> signup({
    required String username,
    required String password,
    required String email,
    required bool isFarmer,
    required bool isBuyer,
    required String location,
    required String phoneNumber,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.baseUrl}/api/signup/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
          'email': email,
          'is_farmer': isFarmer,
          'is_buyer': isBuyer,
          'location': location,
          'phone_number': phoneNumber,
        }),
      );

      if (response.statusCode == 201) {
        return true;
      } else {
        throw Exception('Signup failed: ${response.body}');
      }
    } catch (e) {
      print('Signup error: $e');
      throw Exception('Signup failed: $e');
    }
  }

  Future<bool> refreshTokens() async {
    try {
      if (_refreshToken == null) {
        return false;
      }

      final response = await http.post(
        Uri.parse('${Constants.baseUrl}/api/token/refresh/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refresh': _refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _accessToken = data['access'];
        await _saveTokens();
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (e) {
      print('Token refresh error: $e');
      await logout();
      return false;
    }
  }

  Future<void> _loadUserProfile() async {
    try {
      final response = await http.get(
        Uri.parse('${Constants.baseUrl}/api/profile/'),
        headers: {
          'Authorization': 'Bearer $_accessToken',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _currentUser = User.fromJson(data);
      }
    } catch (e) {
      print('Load profile error: $e');
    }
  }

  Future<void> _saveTokens() async {
    final prefs = await SharedPreferences.getInstance();
    if (_accessToken != null) {
      await prefs.setString('access_token', _accessToken!);
    }
    if (_refreshToken != null) {
      await prefs.setString('refresh_token', _refreshToken!);
    }
  }

  Future<void> _loadTokens() async {
    final prefs = await SharedPreferences.getInstance();
    _accessToken = prefs.getString('access_token');
    _refreshToken = prefs.getString('refresh_token');
  }

  Future<bool> hasValidToken() async {
    await _loadTokens();
    if (_accessToken == null) return false;
    
    // Try to refresh token if needed
    if (_refreshToken != null) {
      await refreshTokens();
    }
    
    return _accessToken != null;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    
    _accessToken = null;
    _refreshToken = null;
    _currentUser = null;
  }

  Future<Map<String, String>> getAuthHeaders() async {
    if (_accessToken == null) {
      await _loadTokens();
    }
    
    return {
      'Authorization': 'Bearer $_accessToken',
      'Content-Type': 'application/json',
    };
  }
}