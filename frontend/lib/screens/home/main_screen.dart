import 'package:flutter/material.dart';
import '../../utils/app_colors.dart';
import '../profile/profile_screen.dart';
import '../products/products_screen.dart';
import '../orders/orders_screen.dart';
import '../weather/weather_screen.dart';
import '../updates/updates_screen.dart';
import '../ai_support/ai_support_screen.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    ProfileScreen(),
    ProductsScreen(),
    OrdersScreen(),
    WeatherScreen(),
    UpdatesScreen(),
    AiSupportScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory),
            label: 'Products',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.wb_sunny),
            label: 'Weather',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.announcement),
            label: 'Updates',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.support_agent),
            label: 'AI Support',
          ),
        ],
      ),
    );
  }
}