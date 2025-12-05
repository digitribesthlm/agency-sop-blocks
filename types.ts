export interface Step {
  id: string;
  code: string; // e.g., "1.1"
  title: string; // e.g., "Questions"
  content: string; // The markdown/HTML content of the SOP
  icon?: string; // Icon name
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string; // Improvement notes
}

export interface Phase {
  id: string;
  title: string; // e.g., "Learning Process"
  phaseNumber: number;
  description?: string;
  steps: Step[];
}

export interface SOPCategory {
  id: string;
  title: string; // e.g., "SEO"
  icon: string;
  description: string;
  phases: Phase[];
  updatedAt: string;
}

export type SOPCollection = SOPCategory[];