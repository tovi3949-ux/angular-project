import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-enter',
  standalone: true,
  imports: [CommonModule, Login, Register, MatButtonModule],
  templateUrl: './enter.html',
  styleUrl: './enter.css'
})
export class Enter {
  isLoginMode = signal<boolean>(true);

  toggleMode() {
    this.isLoginMode.update(val => !val);
  }
}