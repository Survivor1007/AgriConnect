class ApiConfig {
  static const String baseUrl = "http://127.0.0.1:8000/api";

  // Endpoints
  static const String signup = "$baseUrl/signup/";
  static const String login = "$baseUrl/token/";
  static const String refresh = "$baseUrl/products/refresh/";
  static const String products = "$baseUrl/products/";
  static const String orders = "$baseUrl/orders/";
  static const String weather = "$baseUrl/weather-reports/";
  static const String updates = "$baseUrl/updates/";
}
