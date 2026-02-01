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
import { AuthService } from '../../services/auth/auth';
import { finalize } from 'rxjs/internal/operators/finalize';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-task-details-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, FormsModule, MatDividerModule,
    MatProgressBar, MatProgressSpinner
  ],
  templateUrl: './task-details-dialog.html',
  styleUrl: './task-details-dialog.css'
})
export class TaskDetailsDialog implements OnInit {
  data = inject<{ task: Task }>(MAT_DIALOG_DATA);
  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  comments = signal<TaskComment[]>([]);
  newCommentBody = '';
  isLoadingComments = signal<boolean>(false);
  isSendingComment = signal<boolean>(false);
  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoadingComments.set(true);
    this.commentsService.getCommentsByTask(this.data.task.id)
    .pipe(finalize(() => this.isLoadingComments.set(false)))
    .subscribe({
      next: (res) => this.comments.set(res),
      error: () => this.snackBar.open('Error loading comments', 'Close', { duration: 3000 })
    });
  }

sendComment() {
    if (!this.newCommentBody.trim()) return;
    this.isSendingComment.set(true);
    this.commentsService.createComment(this.data.task.id, this.newCommentBody)
    .pipe(finalize(() => this.isSendingComment.set(false)))
    .subscribe({
      next: (newComment) => {
        if (!newComment.author_name) {
          newComment.author_name = this.authService.currentUser()?.name || 'Me';
        }
        
        this.comments.update(prev => [newComment, ...prev]);
        this.newCommentBody = '';
      },
      error: () => this.snackBar.open('Error sending comment', 'Close', { duration: 3000 })
    });
  }
  getUserColor(name: string): string {
    if (!name) return '#000000';
  const colors = ['#6366f1', '#10b981', '#f43f5e', '#8b5cf6', '#fbbf24'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
isMyComment(comment: TaskComment): boolean {
return comment.user_id === this.authService.currentUser()?.id;
  }
}