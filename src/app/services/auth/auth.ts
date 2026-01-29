import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, User } from '../../models/user';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(this.getUserFromStorage());
  isLoggedIn = computed(() => !!this.currentUser());

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL}/login`, credentials).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL}/register`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    this.currentUser.set(res.user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }
}