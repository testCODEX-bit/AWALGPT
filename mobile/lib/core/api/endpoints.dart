// lib/core/api/endpoints.dart
class ApiEndpoints {
  static const String baseUrl = 'http://10.0.2.2:5000'; // Pour Android
  // static const String baseUrl = 'http://localhost:5000'; // Pour iOS
  // static const String baseUrl = 'http://VOTRE_IP:5000'; // Pour réel
  
  static const String chat = '$baseUrl/api/chat/mobile';
  static const String login = '$baseUrl/api/auth/mobile/login';
  static const String history = '$baseUrl/api/chat/mobile/history';
}