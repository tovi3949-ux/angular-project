import { Component, inject, input, computed, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks/tasks';
import { TaskItem } from '../task-item/task-item';
import { TaskStatus } from '../../models/enums/task-status';
import { TaskPriority } from '../../models/enums/task-priority';
import { Task } from '../../models/task';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule, TaskItem, MatButtonModule, MatIconModule, MatDialogModule,
    MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css'
})
export class TaskBoard implements OnInit {
  private tasksService = inject(TasksService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  projectId = input.required<string>();
  allTasks = toSignal(this.tasksService.tasks$, { initialValue: [] as Task[] });

  todoTasks = computed(() => this.allTasks().filter(t => t.status === TaskStatus.Todo));
  doingTasks = computed(() => this.allTasks().filter(t => t.status === TaskStatus.InProgress));
  doneTasks = computed(() => this.allTasks().filter(t => t.status === TaskStatus.Done));

  protected readonly TaskStatus = TaskStatus;

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl(''),
    priority: new FormControl(TaskPriority.Low),
    status: new FormControl(TaskStatus.Todo)
  });

  @ViewChild('taskDialog') taskDialogTpl!: TemplateRef<any>;
  @ViewChild('deleteConfirmDialog') deleteConfirmTpl!: TemplateRef<any>;

  ngOnInit() {
    this.tasksService.getAllByProject(Number(this.projectId())).subscribe();
  }

  openAddTask(status: TaskStatus) {
    this.taskForm.reset({ 
      status, 
      priority: TaskPriority.Low, 
      title: '', 
      description: '' 
    });
    this.dialog.open(this.taskDialogTpl, { width: '400px' });
  }

  confirmSaveTask() {
    if (this.taskForm.invalid) return;

    const newTask = {
      ...this.taskForm.value,
      projectId: Number(this.projectId())
    };

    this.tasksService.createTask(newTask as Task).subscribe({
      next: () => {
        this.snackBar.open('task added successfully', '', { duration: 2000 });
        this.dialog.closeAll();
      }
    });
  }

  onStatusChange(taskId: number, newStatus: TaskStatus) {
    this.tasksService.updateTask(taskId, { status: newStatus }).subscribe(() => {
      this.snackBar.open('status updated', '', { duration: 2000 });
    });
  }

  onDeleteRequest(task: Task) {
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, { data: task });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.tasksService.deleteTask(task.id).subscribe(() => {
          this.snackBar.open('task deleted', '', { duration: 2000 });
        });
      }
    });
  }
}