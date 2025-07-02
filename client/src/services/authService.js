import { apiService } from './api';

class AuthService {
  async login(email, password) {
    return apiService.post('/auth/login', { email, password });
  }

  async register(userData) {
    return apiService.post('/auth/register', userData);
  }

  async getProfile() {
    return apiService.get('/users/profile');
  }

  async updateProfile(userData) {
    return apiService.put('/users/profile', userData);
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
