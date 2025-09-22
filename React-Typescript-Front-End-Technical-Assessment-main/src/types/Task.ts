export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string; // ISO date string
  createdAt: Date;
}

export type TaskFormData = {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string; // ISO date string
};