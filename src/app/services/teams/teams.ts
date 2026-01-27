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
  private Teams = new BehaviorSubject<Team[]>([]);
  Teams$ = this.Teams.asObservable();

  getTeams(): Observable<Team[]> {
    this.http.get<Team[]>(`${this.URL}`).subscribe((teams) => {
       this.Teams.next(teams);
    });
    return this.Teams.asObservable();
  }

  createTeam(data: { name: string }): Observable<void> {
    return this.http.post<void>(`${this.URL}`, data).pipe(
      tap(() => {
        
      })
    );
  }

  addMember(teamId: string, userId: string): Observable<void> {
    return this.http
      .post<void>(`${this.URL}/${teamId}/members`, { userId })
      .pipe(
        tap(() => {
        })
      );
  }
}