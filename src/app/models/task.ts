import { TaskStatus } from './enums/task-status';
import { TaskPriority } from './enums/task-priority';

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: number;
  dueDate:string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}


export interface TaskResponse {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: number;
  due_date:string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

