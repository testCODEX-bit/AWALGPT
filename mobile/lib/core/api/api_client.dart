// lib/core/api/api_client.dart
import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;

class ApiException implements Exception {
  final int? statusCode;
  final String message;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException(statusCode: $statusCode, message: $message)';
}

class ApiClient {
  final String baseUrl;
  String? authToken;
  final Duration timeout;

  ApiClient({this.baseUrl = 'http://10.0.2.2:5000', this.timeout = const Duration(seconds: 10)});

  void setAuthToken(String token) => authToken = token;
  void clearAuthToken() => authToken = null;

  Future<Map<String, dynamic>> post({
    required String endpoint,
    required Map<String, dynamic> body,
    bool requiresAuth = false,
  }) async {
    final url = Uri.parse('$baseUrl$endpoint');

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth && authToken != null) {
      headers['Authorization'] = 'Bearer $authToken';
    }

    http.Response response;
    try {
      response = await http.post(
        url,
        headers: headers,
        body: json.encode(body),
      ).timeout(timeout);
    } on TimeoutException catch (e) {
      throw ApiException('Request timed out: $e');
    } catch (e) {
      throw ApiException('Network error: $e');
    }

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> get({
    required String endpoint,
    Map<String, String>? queryParams,
    bool requiresAuth = false,
  }) async {
    var url = Uri.parse('$baseUrl$endpoint');

    if (queryParams != null) {
      url = url.replace(queryParameters: queryParams);
    }

    final headers = <String, String>{
      'Accept': 'application/json',
    };

    if (requiresAuth && authToken != null) {
      headers['Authorization'] = 'Bearer $authToken';
    }

    http.Response response;
    try {
      response = await http.get(url, headers: headers).timeout(timeout);
    } on TimeoutException catch (e) {
      throw ApiException('Request timed out: $e');
    } catch (e) {
      throw ApiException('Network error: $e');
    }

    return _handleResponse(response);
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    final status = response.statusCode;

    if (status >= 200 && status < 300) {
      final body = response.body;
      if (body.isEmpty) return <String, dynamic>{};
      try {
        final decoded = json.decode(body);
        if (decoded is Map<String, dynamic>) return decoded;
        return <String, dynamic>{'data': decoded};
      } catch (e) {
        // Return raw body under 'raw' key if JSON decoding fails
        return <String, dynamic>{'raw': body};
      }
    }

    // Non-success response
    final message = response.body.isNotEmpty ? response.body : 'Status $status';
    throw ApiException('API error: $message', statusCode: status);
  }
}