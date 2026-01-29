import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = new AuthService();
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  errorMassage= signal<string | null>(null);
  router = inject(Router);  
  
  
  onSubmit() {
    const { email, password } = this.loginForm.value;
    if(typeof email == 'string' && typeof password == 'string')
    this.authService.login({email, password}).subscribe({
      next: () => {
        this.errorMassage.set(null);
        console.log('Login successful');
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        if(err.status === 401)
          this.errorMassage.set('Login failed: Invalid email or password');
        else
          this.errorMassage.set('Login failed: An unexpected error occurred');
      },
    });
  }
}
