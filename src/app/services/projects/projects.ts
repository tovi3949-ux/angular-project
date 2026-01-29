import { inject, Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { Project } from '../../models/project';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({
  providedIn: 'root',
})
export class  ProjectService {
  private readonly URL = `${environment.apiUrl}/projects`;
  private http = inject(HttpClient);
  private projects = new BehaviorSubject<Project[]>([]);
  projects$ = this.projects.asObservable();
  getProjects(teamId: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.URL).pipe(
      tap((projects) => this.projects.next(projects.filter(p => p.team_id === Number(teamId))))
    );
  }
  createProject(data: { name: string; description: string; teamId: string }): Observable<Project> {
    return this.http.post<Project>(this.URL, data).pipe(
      tap((res) => {
        const currentProjects = this.projects.getValue();
        this.projects.next([...currentProjects, res]);
      })
    );
  }
}
