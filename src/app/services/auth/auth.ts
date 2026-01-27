import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, User } from '../../models/user';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  private readonly URL = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  

  login(credentials: { email: string; password: string }) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }
  
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  register(data: { name: string; email: string; password: string }) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL}/register`, data).pipe(
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }
}