import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar autenticación
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Luego verificar rol
  if (authService.hasRole('admin')) {
    console.log('✅ adminGuard: Usuario es admin, permitiendo acceso');
    return true;
  }

  console.log('❌ adminGuard: Usuario no es admin, acceso denegado');
  router.navigate(['/forbidden']); // Página de error 403
  return false;
};
