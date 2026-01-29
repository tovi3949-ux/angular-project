import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TaskComment } from '../../models/taskComment';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/comments`;

  getCommentsByTask(taskId: number): Observable<TaskComment[]> {
    const params = new HttpParams().set('taskId', taskId.toString());
    return this.http.get<TaskComment[]>(this.URL, { params });
  }

  createComment(taskId: number, body: string): Observable<TaskComment> {
    return this.http.post<TaskComment>(this.URL, { taskId, body });
  }
}