const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '');

export interface Client {
  id: string;
  name: string;
}

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  },
};

