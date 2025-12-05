const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '');

export interface TimeLog {
  _id?: string;
  userId: string;
  clientId?: string;
  categoryId: string;
  categoryTitle: string;
  phaseId: string;
  phaseTitle: string;
  stepId: string;
  stepTitle: string;
  stepCode: string;
  seconds: number;
  date: string;
  createdAt?: string;
}

export interface TimeSummary {
  totalSeconds: number;
  totalHours: number;
  byCategory: Record<string, { seconds: number; hours: number; categoryTitle: string }>;
  byPhase: Record<string, { seconds: number; hours: number; phaseTitle: string }>;
  byStep: Record<string, { seconds: number; hours: number; stepTitle: string }>;
  byClient: Record<string, { seconds: number; hours: number; clientName: string }>;
  byDate: Record<string, { seconds: number; hours: number }>;
}

export const timeTrackingService = {
  logTime: async (log: Omit<TimeLog, '_id' | 'createdAt'>): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/time-tracking/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) {
        throw new Error('Failed to log time');
      }
    } catch (error) {
      console.error('Error logging time:', error);
      throw error;
    }
  },

  getSummary: async (startDate?: string, endDate?: string, userId?: string): Promise<TimeSummary> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (userId) params.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/time-tracking/summary?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching time summary:', error);
      throw error;
    }
  },

  getLogs: async (startDate?: string, endDate?: string, userId?: string): Promise<TimeLog[]> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (userId) params.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/time-tracking/logs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching time logs:', error);
      throw error;
    }
  },
};

