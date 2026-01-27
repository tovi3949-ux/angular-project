import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken(); 

  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json', // 
      ...(token ? { Authorization: `Bearer ${token}` } : {}) // 
    }
  });

  return next(authReq);
};
