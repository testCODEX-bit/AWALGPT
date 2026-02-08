// site_web/src/services/api.ts
import axios from 'axios';
// Configuration de l'API
const API_BASE_URL = 'http://localhost:8000'; // Votre FastAPI local
// Types TypeScript
export interface ChatMessage {
id: string;
text: string;
isUser: boolean;
timestamp: Date;
dialect?: string;
intent?: string;
}
export interface ChatRequest {
message: string;
user_id?: string;
session_id?: string;
dialect?: string;
}
export interface ChatResponse {
success: boolean;
original_message: string;
processed_message: string;
intent: string;
detected_dialect: string;
response: string;
processing_time_ms: number;
conversation_id?: string;
metadata: Record<string, any>;
}
export interface UserHistory {
success: boolean;
user_id: string;
conversations: Array<{
timestamp: string;
original_message: string;
response: string;
intent: string;
dialect: string;
processing_time_ms: number;
}>;
total: number;
}
export interface SystemStats {
success: boolean;
system_stats: Record<string, any>;
response_generator_stats: Record<string, any>;
database_stats: Record<string, any>;
}
// Instance Axios configurée
const api = axios.create({
baseURL: API_BASE_URL,
headers: {
'Content-Type': 'application/json',
},
timeout: 30000, // 30 secondes timeout
});
// Intercepteur pour ajouter l'user_id automatiquement
api.interceptors.request.use((config) => {
const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
if (userId && config.data) {
config.data.user_id = userId;
}
return config;
});
// Services API
export const apiService = {
// Envoyer un message au chatbot
async sendMessage(data: ChatRequest): Promise<ChatResponse> {
try {
const response = await api.post<ChatResponse>('/chat', data);
return response.data;
} catch (error) {
console.error('Erreur lors de l\'envoi du message:', error);
throw error;
}
},
// Récupérer l'historique utilisateur
async getUserHistory(userId: string, limit: number = 20): Promise<UserHistory> {
try {
const response = await api.get<UserHistory>(`/history/${userId}?limit=${limit}`);
return response.data;
} catch (error) {
console.error('Erreur lors de la récupération de l\'historique:', error);
throw error;
}
},
// Obtenir les statistiques système
async getSystemStats(): Promise<SystemStats> {
try {
const response = await api.get<SystemStats>('/stats');
return response.data;
} catch (error) {
console.error('Erreur lors de la récupération des statistiques:', error);
throw error;
}
},
// Vérifier la santé du système
async checkHealth() {
try {
54/89
const response = await api.get('/health');
return response.data;
} catch (error) {
console.error('Erreur de santé du système:', error);
throw error;
}
},
// Entraîner les modèles
async trainModels() {
try {
const response = await api.post('/train', {});
return response.data;
} catch (error) {
console.error('Erreur lors de l\'entraînement:', error);
throw error;
}
},
// Exporter le dataset
async exportDataset() {
try {
const response = await api.get('/export/dataset');
return response.data;
} catch (error) {
console.error('Erreur lors de l\'export:', error);
throw error;
}
},
// Créer une sauvegarde
async createBackup() {
try {
const response = await api.post('/backup', {});
return response.data;
} catch (error) {
console.error('Erreur lors de la sauvegarde:', error);
throw error;
}
},
};
// Hook React pour utiliser l'API
export const useApi = () => {
return apiService;
};
export default api;
