import 'package:flutter/material.dart';
import '../../models/product_model.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../utils/app_colors.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';

class ProductDetailsScreen extends StatefulWidget {
  final Product product;

  const ProductDetailsScreen({Key? key, required this.product}) : super(key: key);

  @override
  _ProductDetailsScreenState createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  final _quantityController = TextEditingController();
  final _apiService = ApiService();
  final _authService = AuthService();
  bool _isLoading = false;

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    if (_quantityController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter quantity')),
      );
      return;
    }

    final quantity = int.tryParse(_quantityController.text);
    if (quantity == null || quantity <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter a valid quantity')),
      );
      return;
    }

    if (quantity > widget.product.quantity) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Quantity exceeds available stock')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final totalPrice = quantity * widget.product.pricePerUnit;
      
      await _apiService.createOrder(
        productId: widget.product.id,
        quantity: quantity,
        totalPrice: totalPrice,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Order placed successfully!')),
      );
      
      Navigator.of(context).pop();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to place order: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = _authService.currentUser;
    final canOrder = currentUser?.isBuyer ?? false;

    return Scaffold(
      appBar: AppBar(
        title: Text('Product Details'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [AppColors.primary.withOpacity(0.8), AppColors.primary],
                ),
              ),
              child: Icon(
                Icons.inventory,
                size: 80,
                color: Colors.white,
              ),
            ),
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.product.name,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: widget.product.available ? AppColors.success : AppColors.error,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          widget.product.available ? 'Available' : 'Out of Stock',
                          style: TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  _buildDetailRow('Description', widget.product.description),
                  _buildDetailRow('Farmer', widget.product.farmerName),
                  _buildDetailRow('Price per ${widget.product.unit}', '₹${widget.product.pricePerUnit}'),
                  _buildDetailRow('Available Quantity', '${widget.product.quantity} ${widget.product.unit}'),
                  _buildDetailRow('Listed on', _formatDate(widget.product.createdAt)),
                  
                  if (canOrder && widget.product.available) ...[
                    SizedBox(height: 24),
                    Divider(),
                    SizedBox(height: 16),
                    Text(
                      'Place Order',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                    SizedBox(height: 16),
                    CustomTextField(
                      controller: _quantityController,
                      labelText: 'Quantity (${widget.product.unit})',
                      keyboardType: TextInputType.number,
                      prefixIcon: Icons.shopping_cart,
                    ),
                    SizedBox(height: 16),
                    CustomButton(
                      text: 'Place Order',
                      onPressed: _placeOrder,
                      isLoading: _isLoading,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: TextStyle(color: Colors.grey[800]),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}