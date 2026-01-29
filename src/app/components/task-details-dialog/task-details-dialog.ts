import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskComment } from '../../models/taskComment';
import { CommentsService } from '../../services/comments/comments';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-details-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, FormsModule, MatDividerModule
  ],
  templateUrl: './task-details-dialog.html',
  styleUrl: './task-details-dialog.css'
})
export class TaskDetailsDialog implements OnInit {
  data = inject<{ task: Task }>(MAT_DIALOG_DATA);
  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar);

  comments = signal<TaskComment[]>([]);
  newCommentBody = '';

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentsService.getCommentsByTask(this.data.task.id).subscribe({
      next: (res) => this.comments.set(res),
      error: () => this.snackBar.open('Error loading comments', 'Close', { duration: 3000 })
    });
  }

  sendComment() {
    if (!this.newCommentBody.trim()) return;

    this.commentsService.createComment(this.data.task.id, this.newCommentBody).subscribe({
      next: (newComment) => {
        this.comments.update(prev => [newComment, ...prev]);
        this.newCommentBody = '';
      },
      error: () => this.snackBar.open('Error sending comment', 'Close', { duration: 3000 })
    });
  }
}