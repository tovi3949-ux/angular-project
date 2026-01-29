import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environment';
import { Team } from '../../models/team';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly URL = `${environment.apiUrl}/teams`;
  private http = inject(HttpClient);
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamsSubject.asObservable();

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.URL).pipe(
      tap((teams) => this.teamsSubject.next(teams))
    );
  }

  createTeam(data: { name: string }): Observable<Team> {
    return this.http.post<Team>(this.URL, data).pipe(
      tap((res) => {
        const currentTeams = this.teamsSubject.getValue();
        this.teamsSubject.next([...currentTeams, {...res, members_count: 1 }]);
      })
    );
  }

  addMember(teamId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.URL}/${teamId}/members`, { userId }).pipe(
      tap(() => {
        const teams = this.teamsSubject.getValue();
        const index = teams.findIndex((t) => t.id === Number(teamId));
        if (index !== -1) {
          const updatedTeams = [...teams];
          updatedTeams[index] = {
            ...updatedTeams[index],
            members_count: (updatedTeams[index].members_count || 0) + 1
          };
          this.teamsSubject.next(updatedTeams);
        }
      })
    );
  }
}