import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from '../../models/task';
import { environment } from '../../environment';
import { TaskPriority } from '../../models/enums/task-priority';
import { TaskStatus } from '../../models/enums/task-status';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/tasks`;

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  getAllByProject(projectId: number): Observable<Task[]> {
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get<Task[]>(this.URL, { params }).pipe(
      tap((tasks) => this.tasksSubject.next(tasks))
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.URL, task).pipe(
      tap((newTask) => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([...currentTasks, newTask]);
      })
    );
  }

  updateTask(id: number, updates: { priority?: TaskPriority; status?: TaskStatus; title?: string }): Observable<Task> {
    return this.http.patch<Task>(`${this.URL}/${id}`, updates).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.getValue();
        const index = currentTasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          const updatedList = [...currentTasks];
          updatedList[index] = { ...updatedList[index], ...updatedTask };
          this.tasksSubject.next(updatedList);
        }
      })
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next(currentTasks.filter((t) => t.id !== taskId));
      })
    );
  }
}