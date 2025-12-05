import { SOPCollection, SOPCategory, Step } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const SOPService = {
  getAll: async (): Promise<SOPCollection> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<SOPCategory | undefined> => {
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

  updateStep: async (categoryId: string, phaseId: string, stepId: string, updates: Partial<Step>): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/${categoryId}/phases/${phaseId}/steps/${stepId}`,
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