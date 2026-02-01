import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { finalize } from 'rxjs/internal/operators/finalize';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIcon, MatProgressSpinner],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService); 
  router = inject(Router);
  isLoading = signal(false);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMassage = signal<string | null>(null);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true); 
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login({ email: email!, password: password! })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/teams']),
        error: (err) => {
          if (err.status === 401) {
          this.errorMassage.set('Invalid email or password');
          } else {
          this.errorMassage.set('Login failed: An unexpected error occurred');
          }}
      });
    }
  }
}
