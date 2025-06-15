import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta AuthService
  const router = inject(Router);         // Inyecta Router

  const currentUser = authService.currentUserValue;

  if (currentUser && currentUser.token) {
    // Usuario autenticado, se permite el acceso
    return true;
  }

  // No autenticado, redirigir a la página de login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
