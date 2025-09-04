// models/product_model.dart
class Product {
  final int id;
  final String name;
  final String description;
  final int quantity;
  final double pricePerUnit;
  final String unit;
  final bool available;
  final String farmerName;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.quantity,
    required this.pricePerUnit,
    required this.unit,
    required this.available,
    required this.farmerName,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      quantity: json['quantity'] ?? 0,
      pricePerUnit: (json['price_per_unit'] ?? 0.0).toDouble(),
      unit: json['unit'] ?? '',
      available: json['available'] ?? true,
      farmerName: json['farmer_name'] ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
}
