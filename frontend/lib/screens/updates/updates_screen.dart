// screens/updates/updates_screen.dart
import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/update_model.dart';
import '../../utils/app_colors.dart';
import '../../widgets/error_widget.dart';
import '../../widgets/empty_state_widget.dart';

class UpdatesScreen extends StatefulWidget {
  @override
  _UpdatesScreenState createState() => _UpdatesScreenState();
}

class _UpdatesScreenState extends State<UpdatesScreen> {
  final ApiService _apiService = ApiService();
  
  List<Update> _updates = [];
  bool _isLoading = true;
  String? _error;
  String _selectedCategory = 'all';

  @override
  void initState() {
    super.initState();
    _loadUpdates();
  }

  Future<void> _loadUpdates() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final updates = await _apiService.getUpdates();
      setState(() {
        _updates = updates;
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

  List<Update> get _filteredUpdates {
    if (_selectedCategory == 'all') {
      return _updates;
    }
    return _updates.where((update) => update.category == _selectedCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Updates & News'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadUpdates,
          ),
        ],
      ),
      body: Column(
        children: [
          // Category filter
          Container(
            height: 60,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              children: [
                _buildCategoryChip('all', 'All'),
                _buildCategoryChip('news', 'News'),
                _buildCategoryChip('technology', 'Technology'),
                _buildCategoryChip('tips', 'Tips & Best Practices'),
              ],
            ),
          ),
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _error != null
                    ? CustomErrorWidget(
                        message: _error!,
                        onRetry: _loadUpdates,
                      )
                    : _filteredUpdates.isEmpty
                        ? EmptyStateWidget(
                            title: 'No Updates Available',
                            subtitle: 'Check back later for new updates and news',
                            icon: Icons.announcement_outlined,
                          )
                        : RefreshIndicator(
                            onRefresh: _loadUpdates,
                            child: ListView.builder(
                              itemCount: _filteredUpdates.length,
                              itemBuilder: (context, index) {
                                final update = _filteredUpdates[index];
                                return UpdateCard(update: update);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(String value, String label) {
    final isSelected = _selectedCategory == value;
    return Container(
      margin: EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedCategory = value;
          });
        },
        selectedColor: AppColors.primary,
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.black,
        ),
      ),
    );
  }
}

class UpdateCard extends StatelessWidget {
  final Update update;

  const UpdateCard({Key? key, required this.update}) : super(key: key);

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
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getCategoryColor(update.category),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    update.category.toUpperCase(),
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Text(
                  _formatDate(update.publishedAt),
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Text(
              update.title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              update.content,
              style: TextStyle(
                color: Colors.grey[700],
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'news':
        return AppColors.info;
      case 'technology':
        return AppColors.secondary;
      case 'tips':
        return AppColors.success;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}