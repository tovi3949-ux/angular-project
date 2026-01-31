import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Task, TaskResponse } from '../../models/task';
import { environment } from '../../environment.prod';
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
    return this.http.get<TaskResponse[]>(this.URL, { params }).pipe(

      tap((tasks) => {
        console.log('Fetched tasks:', tasks);
        this.tasksSubject.next(tasks.map(t => ({ ...t, dueDate: t.due_date ? t.due_date : null })));
      })
      ,map((tasks) => tasks.map(t => ({ ...t, dueDate: t.due_date ? t.due_date : null })))
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<TaskResponse>(this.URL, task).pipe(
      tap((newTask) => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([...currentTasks, { ...newTask, dueDate: newTask.due_date ? newTask.due_date : null } ]);
      }),
      map((newTask) => ({ ...newTask, dueDate: newTask.due_date ? newTask.due_date : null }))
    );
  }

  updateTask(id: number, updates: { priority?: TaskPriority; status?: TaskStatus; title?: string }): Observable<Task> {
    return this.http.patch<TaskResponse>(`${this.URL}/${id}`, updates).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.getValue();
        const index = currentTasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          const updatedList = [...currentTasks];
          updatedList[index] = { ...updatedList[index], ...updatedTask, dueDate: updatedTask.due_date ? updatedTask.due_date : null };
          this.tasksSubject.next(updatedList);
        }
      })
      ,map((updatedTask) => ({ ...updatedTask, dueDate: updatedTask.due_date ? updatedTask.due_date : null }))
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