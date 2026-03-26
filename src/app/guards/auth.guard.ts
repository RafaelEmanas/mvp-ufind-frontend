import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap, map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    tap((user) => {
      authService.setUser(user);
    }),
    map(() => true),
    catchError((error) => {
      return of(router.parseUrl('/login'));
    }),
  );
};
