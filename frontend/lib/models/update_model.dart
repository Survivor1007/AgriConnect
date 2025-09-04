// models/update_model.dart
class Update {
  final int id;
  final String title;
  final String content;
  final String category;
  final DateTime publishedAt;

  Update({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    required this.publishedAt,
  });

  factory Update.fromJson(Map<String, dynamic> json) {
    return Update(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      category: json['category'] ?? 'news',
      publishedAt: DateTime.parse(json['published_at'] ?? DateTime.now().toIso8601String()),
    );
  }
}