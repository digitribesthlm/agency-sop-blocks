import { SOPCollection, SOPCategory, Step, Phase } from '../types';

// In production, use same origin (Vercel handles routing)
// In development, use localhost backend
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

// Validate API URL is configured
if (!API_BASE_URL && !import.meta.env.DEV) {
  console.error('VITE_API_URL is not configured. Please set it in your environment variables.');
}

export const SOPService = {
  getAll: async (): Promise<SOPCollection> => {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
    }
    
    try {
      console.log('Fetching categories from:', `${API_BASE_URL}/categories`);
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('API returned invalid data format. Expected an array.');
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to API at ${API_BASE_URL}. Please check if the server is running.`);
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<SOPCategory | undefined> => {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw error;
    }
  },

  createPhase: async (categoryId: string, title: string, description: string, phaseNumber: number): Promise<Phase> => {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
    }
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/phases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryId,
            title,
            description,
            phaseNumber,
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.phase;
    } catch (error) {
      console.error('Failed to create phase:', error);
      throw error;
    }
  },

  createStep: async (phaseId: string, code: string, title: string, content?: string, status?: Step['status'], notes?: string): Promise<Step> => {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
    }
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/steps`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phaseId,
            code,
            title,
            content: content || '',
            status: status || 'pending',
            notes: notes || '',
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.step;
    } catch (error) {
      console.error('Failed to create step:', error);
      throw error;
    }
  },

  updateStep: async (categoryId: string, phaseId: string, stepId: string, updates: Partial<Step>): Promise<void> => {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
    }
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/steps/${stepId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update step:', error);
      throw error;
    }
  }
};