import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIcon, MatProgressSpinner],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = signal(false);
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  errorMassage = signal<string | null>(null);
  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }
    this.isLoading.set(true);
    const { name, email, password } = this.registerForm.value;
    if (typeof email == 'string' && typeof password == 'string' && typeof name == 'string')
      this.authService.register({ name, email, password })
      .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
        next: () => {
          this.errorMassage.set(null);
          this.router.navigate(['/teams']);
      },
        error: (err) => {
          if (err.status === 409)
            this.errorMassage.set('Registration failed: Email already in use');
          else
            this.errorMassage.set('Registration failed: An unexpected error occurred');
        },
      });
  }
}
