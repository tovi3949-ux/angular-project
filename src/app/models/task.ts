import { TaskStatus } from './enums/task-status';
import { TaskPriority } from './enums/task-priority';

export interface Task {
  id?: number;
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
  orderIndex?: number;
}