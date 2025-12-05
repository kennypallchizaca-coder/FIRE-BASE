import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/firebase/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay un usuario autenticado
  if (authService.isAuthenticated()) {
    console.log(' authGuard: Usuario autenticado, permitiendo acceso');
    return true;
  }

  console.log(' authGuard: Usuario no autenticado, redirigiendo a login');
  
  // Guardar la URL intentada para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
