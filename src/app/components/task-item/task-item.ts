import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/enums/task-status';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  task = input.required<Task>();
  
  statusChanged = output<TaskStatus>();
  deleteRequested = output<Task>();

  protected readonly TaskStatus = TaskStatus;

  changeStatus(newStatus: TaskStatus) {
    this.statusChanged.emit(newStatus);
  }

  onDeleteClick() {
    this.deleteRequested.emit(this.task());
  }
}