// In production, use same origin (Vercel handles routing)
// In development, use localhost backend
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

// Validate API URL is configured
if (!API_BASE_URL && !import.meta.env.DEV) {
  console.error('VITE_API_URL is not configured. Please set it in your environment variables.');
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  clientId?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<boolean> => {
    if (!API_BASE_URL) {
      console.error('API URL not configured');
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

