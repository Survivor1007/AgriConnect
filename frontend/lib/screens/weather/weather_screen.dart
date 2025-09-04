// screens/weather/weather_screen.dart
import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/weather_model.dart';
import '../../utils/app_colors.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/error_widget.dart';
import '../../widgets/empty_state_widget.dart';

class WeatherScreen extends StatefulWidget {
  @override
  _WeatherScreenState createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _locationController = TextEditingController();
  
  List<WeatherReport> _weatherReports = [];
  bool _isLoading = false;
  bool _isCreating = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadWeatherReports();
  }

  @override
  void dispose() {
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _loadWeatherReports() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final reports = await _apiService.getWeatherReports();
      setState(() {
        _weatherReports = reports;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _createWeatherReport() async {
    if (_locationController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter a location')),
      );
      return;
    }

    setState(() {
      _isCreating = true;
    });

    try {
      await _apiService.createWeatherReport(
        location: _locationController.text.trim(),
      );
      _locationController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Weather report requested successfully')),
      );
      _loadWeatherReports();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to get weather report: $e')),
      );
    } finally {
      setState(() {
        _isCreating = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Weather Reports'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadWeatherReports,
          ),
        ],
      ),
      body: Column(
        children: [
          // Weather request form
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 1,
                  blurRadius: 3,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Get Weather Report',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: _locationController,
                        labelText: 'Location',
                        prefixIcon: Icons.location_on,
                        hintText: 'Enter city or location name',
                      ),
                    ),
                    SizedBox(width: 12),
                    CustomButton(
                      text: 'Get Report',
                      onPressed: _createWeatherReport,
                      isLoading: _isCreating,
                      width: 120,
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Weather reports list
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _error != null
                    ? CustomErrorWidget(
                        message: _error!,
                        onRetry: _loadWeatherReports,
                      )
                    : _weatherReports.isEmpty
                        ? EmptyStateWidget(
                            title: 'No Weather Reports',
                            subtitle: 'Request a weather report for your location',
                            icon: Icons.wb_sunny_outlined,
                          )
                        : RefreshIndicator(
                            onRefresh: _loadWeatherReports,
                            child: ListView.builder(
                              itemCount: _weatherReports.length,
                              itemBuilder: (context, index) {
                                final report = _weatherReports[index];
                                return WeatherCard(report: report);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}

class WeatherCard extends StatelessWidget {
  final WeatherReport report;

  const WeatherCard({Key? key, required this.report}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.location_on, color: AppColors.primary),
                    SizedBox(width: 8),
                    Text(
                      report.location,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Text(
                  _formatDate(report.reportDate),
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildWeatherInfo(
                  Icons.thermostat,
                  '${report.temperature.toInt()}°C',
                  'Temperature',
                ),
                _buildWeatherInfo(
                  Icons.water_drop,
                  '${report.humidity.toInt()}%',
                  'Humidity',
                ),
                _buildWeatherInfo(
                  Icons.cloud_outlined,
                  '${report.rainfall.toInt()}mm',
                  'Rainfall',
                ),
              ],
            ),
            SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                report.conditions,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: AppColors.primary,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeatherInfo(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primary),
        SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
