// lib/core/services/chat_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ChatService {
  final String baseUrl;
  final String userId;
  
  ChatService({required this.baseUrl, required this.userId});
  
  Future<ChatResponse> sendMessage({
    required String message,
    bool translateToAmazigh = true,
    String language = 'fr',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/chat/mobile'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'message': message,
          'userId': userId,
          'translateToAmazigh': translateToAmazigh,
          'language': language,
        }),
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ChatResponse.fromJson(data);
        } else {
          throw Exception(data['error'] ?? 'Erreur inconnue');
        }
      } else {
        throw Exception('Erreur HTTP: ${response.statusCode}');
      }
    } catch (e) {
      rethrow;
    }
  }
  
  Future<List<ChatHistory>> getHistory() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/chat/mobile/history?userId=$userId'),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true) {
        return List<Map<String, dynamic>>.from(data['history'])
            .map((item) => ChatHistory.fromJson(item))
            .toList();
      }
    }
    return [];
  }
}

class ChatResponse {
  final String response;
  final String? amazighTranslation;
  final String timestamp;
  final String messageId;
  
  ChatResponse({
    required this.response,
    this.amazighTranslation,
    required this.timestamp,
    required this.messageId,
  });
  
  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    return ChatResponse(
      response: json['response'],
      amazighTranslation: json['amazighTranslation'],
      timestamp: json['timestamp'],
      messageId: json['messageId'],
    );
  }
}

class ChatHistory {
  final String messageId;
  final String message;
  final String response;
  final String timestamp;

  ChatHistory({
    required this.messageId,
    required this.message,
    required this.response,
    required this.timestamp,
  });

  factory ChatHistory.fromJson(Map<String, dynamic> json) {
    return ChatHistory(
      messageId: json['messageId']?.toString() ?? '',
      message: json['message']?.toString() ?? '',
      response: json['response']?.toString() ?? '',
      timestamp: json['timestamp']?.toString() ?? '',
    );
  }
}