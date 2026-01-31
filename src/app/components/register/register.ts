import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIcon],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  errorMassage = signal<string | null>(null);
  onSubmit() {
    
    const { name, email, password } = this.registerForm.value;
    if (typeof email == 'string' && typeof password == 'string' && typeof name == 'string')
      this.authService.register({ name, email, password }).subscribe({
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
