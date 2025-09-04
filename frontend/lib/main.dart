import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/main_screen.dart';
import 'utils/app_theme.dart';
import 'utils/constants.dart';

void main() {
  runApp(FarmConnectApp());
}

class FarmConnectApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Farm Connect',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: FutureBuilder<bool>(
        future: AuthService().hasValidToken(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          
          if (snapshot.data == true) {
            return MainScreen();
          } else {
            return LoginScreen();
          }
        },
      ),
      routes: {
        '/login': (context) => LoginScreen(),
        '/main': (context) => MainScreen(),
      },
    );
  }
}