import { TaskStatus } from './enums/task-status';
import { TaskPriority } from './enums/task-priority';

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: number;
  due_date: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

