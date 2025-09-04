// models/order_model.dart
class Order {
  final int id;
  final int productId;
  final String productName;
  final int quantity;
  final double totalPrice;
  final String status;
  final String buyerName;
  final String farmerName;
  final DateTime createdAt;

  Order({
    required this.id,
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.totalPrice,
    required this.status,
    required this.buyerName,
    required this.farmerName,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? 0,
      productId: json['product_id'] ?? 0,
      productName: json['product_name'] ?? '',
      quantity: json['quantity'] ?? 0,
      totalPrice: (json['total_price'] ?? 0.0).toDouble(),
      status: json['status'] ?? 'pending',
      buyerName: json['buyer_name'] ?? '',
      farmerName: json['farmer_name'] ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
}