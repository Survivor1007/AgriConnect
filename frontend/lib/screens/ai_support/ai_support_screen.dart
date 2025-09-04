//# screens/ai_support/ai_support_screen.dart
import 'package:flutter/material.dart';
import '../../utils/app_colors.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';

class AiSupportScreen extends StatefulWidget {
  @override
  _AiSupportScreenState createState() => _AiSupportScreenState();
}

class _AiSupportScreenState extends State<AiSupportScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _addWelcomeMessage() {
    setState(() {
      _messages.add(ChatMessage(
        message: "Hello! I'm your AI farming assistant. I can help you with:\n\n• Crop management advice\n• Market price information\n• Weather-related farming tips\n• Best practices for farming\n• Product listing suggestions\n\nHow can I assist you today?",
        isUser: false,
        timestamp: DateTime.now(),
      ));
    });
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;

    final userMessage = _messageController.text.trim();
    _messageController.clear();

    setState(() {
      _messages.add(ChatMessage(
        message: userMessage,
        isUser: true,
        timestamp: DateTime.now(),
      ));
      _isLoading = true;
    });

    // Simulate AI response (replace with actual AI API call)
    await Future.delayed(Duration(seconds: 2));

    final aiResponse = _generateAIResponse(userMessage);
    
    setState(() {
      _messages.add(ChatMessage(
        message: aiResponse,
        isUser: false,
        timestamp: DateTime.now(),
      ));
      _isLoading = false;
    });
  }

  String _generateAIResponse(String userMessage) {
    // Simple response generation (replace with actual AI integration)
    final message = userMessage.toLowerCase();
    
    if (message.contains('weather') || message.contains('rain') || message.contains('temperature')) {
      return "For weather-related queries, I recommend checking the Weather tab in the app for real-time weather reports. Generally, ensure proper drainage during heavy rains and provide adequate irrigation during dry spells.";
    } else if (message.contains('price') || message.contains('market') || message.contains('sell')) {
      return "Market prices vary by location and season. Check the Products tab to see current market listings. For better pricing, ensure good quality produce, proper packaging, and consider seasonal demand patterns.";
    } else if (message.contains('crop') || message.contains('farming') || message.contains('agriculture')) {
      return "For successful crop management: 1) Choose crops suitable for your climate and soil, 2) Follow proper planting schedules, 3) Ensure adequate water supply, 4) Use appropriate fertilizers, 5) Monitor for pests and diseases regularly.";
    } else if (message.contains('pest') || message.contains('disease') || message.contains('insects')) {
      return "For pest and disease management: Use integrated pest management (IPM) practices, regular crop inspection, organic pesticides when possible, and maintain proper crop rotation to reduce disease buildup.";
    } else if (message.contains('fertilizer') || message.contains('nutrition') || message.contains('soil')) {
      return "Soil health is crucial for good yields. Get your soil tested to understand nutrient requirements. Use organic matter like compost, follow recommended NPK ratios, and consider micronutrients based on soil test results.";
    } else {
      return "Thank you for your question! For more specific farming advice, you can ask about weather conditions, market prices, crop management, pest control, or soil nutrition. I'm here to help with your farming needs.";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('AI Farm Assistant'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return ChatBubble(message: message);
              },
            ),
          ),
          if (_isLoading)
            Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                  SizedBox(width: 12),
                  Text('AI is typing...', style: TextStyle(color: Colors.grey[600])),
                ],
              ),
            ),
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
            child: Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _messageController,
                    labelText: 'Ask me anything about farming...',
                    maxLines: 99,
                    enabled: !_isLoading,
                  ),
                ),
                SizedBox(width: 12),
                CustomButton(
                  text: 'Send',
                  onPressed: _isLoading ? null : _sendMessage,
                  width: 80,
                  icon: Icons.send,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ChatMessage {
  final String message;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.message,
    required this.isUser,
    required this.timestamp,
  });
}

class ChatBubble extends StatelessWidget {
  final ChatMessage message;

  const ChatBubble({Key? key, required this.message}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!message.isUser) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.primary,
              child: Icon(Icons.smart_toy, color: Colors.white, size: 16),
            ),
            SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: message.isUser ? AppColors.primary : Colors.grey[200],
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.message,
                    style: TextStyle(
                      color: message.isUser ? Colors.white : Colors.black87,
                      height: 1.4,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    _formatTime(message.timestamp),
                    style: TextStyle(
                      fontSize: 12,
                      color: message.isUser ? Colors.white70 : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (message.isUser) ...[
            SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.grey[300],
              child: Icon(Icons.person, color: Colors.grey[600], size: 16),
            ),
          ],
        ],
      ),
    );
  }

  String _formatTime(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }
}


