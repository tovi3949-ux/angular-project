import { inject, Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Project } from '../../models/project';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';


@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly URL = `${environment.apiUrl}/projects`;
  private http = inject(HttpClient);
  private projects = new BehaviorSubject<Project[] | null>(null);
  @Input() teamId!: string;
  getProjects() :Observable<Project[] | null> {
    return this.http
      .get<Project[]>(`${this.URL}`)
      .pipe(
        map((projects) => projects.filter(project => project.team_id.toString() === this.teamId))
      );
  }
  createProject({ name, description }: { name: string; description: string; }):Observable<void> {
    const project = { name, description, team_id: this.teamId };
    return this.http.post<void>(`${this.URL}`, project);
  }
}
