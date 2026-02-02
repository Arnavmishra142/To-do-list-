export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  updatedAt: number;
}

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
  highPriority: number;
}

export type Priority = 'high' | 'medium' | 'low';
