// models/weather_model.dart
class WeatherReport {
  final int id;
  final String location;
  final DateTime reportDate;
  final double temperature;
  final double humidity;
  final double rainfall;
  final String conditions;

  WeatherReport({
    required this.id,
    required this.location,
    required this.reportDate,
    required this.temperature,
    required this.humidity,
    required this.rainfall,
    required this.conditions,
  });

  factory WeatherReport.fromJson(Map<String, dynamic> json) {
    return WeatherReport(
      id: json['id'] ?? 0,
      location: json['location'] ?? '',
      reportDate: DateTime.parse(json['report_date'] ?? DateTime.now().toIso8601String()),
      temperature: (json['temperature'] ?? 0.0).toDouble(),
      humidity: (json['humidity'] ?? 0.0).toDouble(),
      rainfall: (json['rainfall'] ?? 0.0).toDouble(),
      conditions: json['conditions'] ?? '',
    );
  }
}