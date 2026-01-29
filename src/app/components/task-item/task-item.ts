import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/enums/task-status';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TaskPriority } from '../../models/enums/task-priority';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  task = input.required<Task>();

  statusChanged = output<TaskStatus>();
  deleteRequested = output<Task>();
  priorityUpdateRequested = output<{ task: Task; newPriority: TaskPriority }>();

  protected readonly TaskStatus = TaskStatus;

  changeStatus(newStatus: TaskStatus) {
    this.statusChanged.emit(newStatus);
  }

  onDeleteClick() {
    this.deleteRequested.emit(this.task());
  }

  taskClicked = output<Task>();

  onCardClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;
    this.taskClicked.emit(this.task());
  }
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'normal': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  }
  onTaskClick(event: MouseEvent) {
    event.stopPropagation();
    this.taskClicked.emit(this.task());
  }
  onUpdatePriority(event: Event): void {
    event.stopPropagation();
    this.priorityUpdateRequested.emit({
      task: this.task(),
      newPriority: this.getNextPriority(this.task().priority)
    });
  }

  private getNextPriority(currentPriority: TaskPriority): TaskPriority {
    const taskPriority:TaskPriority = currentPriority;
    const priorities = [TaskPriority.Low, TaskPriority.Normal, TaskPriority.High];
    const currentIndex = priorities.indexOf(taskPriority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    return priorities[nextIndex];
  }
}