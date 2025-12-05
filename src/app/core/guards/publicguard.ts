import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si NO está autenticado, puede acceder a rutas públicas
  if (!authService.isAuthenticated()) {
    console.log('✅ publicGuard: Usuario no autenticado, permitiendo acceso a', state.url);
    return true;
  }

  console.log('⚠️ publicGuard: Usuario ya autenticado, redirigiendo a /home');
  
  // Si ya está autenticado, redirigir a home con replaceUrl
  router.navigateByUrl('/home', { replaceUrl: true });
  return false;
};
