import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-enter',
  standalone: true,
  imports: [CommonModule, Login, Register, MatButtonModule],
  templateUrl: './enter.html',
  styleUrl: './enter.css'
})
export class Enter {
  isLoginMode = signal<boolean>(true);
  authService = inject(AuthService);
  toggleMode() {
    this.isLoginMode.update(val => !val);
  }
  ngOnInit() {
    this.authService.logout();
  }
}