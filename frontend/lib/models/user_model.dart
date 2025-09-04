// models/user_model.dart
class User {
  final int id;
  final String username;
  final String email;
  final bool isFarmer;
  final bool isBuyer;
  final String location;
  final String phoneNumber;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.isFarmer,
    required this.isBuyer,
    required this.location,
    required this.phoneNumber,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      isFarmer: json['is_farmer'] ?? false,
      isBuyer: json['is_buyer'] ?? false,
      location: json['location'] ?? '',
      phoneNumber: json['phone_number'] ?? '',
    );
  }
}