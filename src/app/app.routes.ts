import { Routes } from '@angular/router';
import { authGuard } from './core/guards/authguard';
import { publicGuard } from './core/guards/publicguard';
import { adminGuard } from './core/guards/adminguard';



export const routes: Routes = [
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/pages/login-page/login-page').then(m => m.LoginPage),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./feature/auth/pages/register-page/register-page').then(m => m.RegisterPage),
    canActivate: [publicGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./feature/daisy-page/daisy-page').then(m => m.DaisyPage)
    // SIN guard: Accesible para todos
  },
  {
    path: 'estilos',
    loadComponent: () => import('./feature/estilos-page/estilos-page').then(m => m.EstilosPage),
    canActivate: [authGuard]
  },
  {
    path: 'simpsons',
    loadComponent: () => import('./feature/simpsons-page/simpsons-page').then(m => m.SimpsonsPage),
    canActivate: [authGuard]
  },
  {
    path: 'simpsons/:id',
    loadComponent: () => import('./feature/simpson-detail-page/simpson-detail-page').then(m => m.SimpsonDetailPage),
    canActivate: [authGuard]
  },
  {
  path: 'admin',
  loadComponent: () => import('./feature/auth/pages/AdminComponetPage/AdminComponetPage').then(m => m.AdminPanelComponent),
  canActivate: [authGuard, adminGuard] // Ambos guards
},
  {
    path: 'forbidden',
    loadComponent: () => import('./feature/forbidden-page/forbidden-page').then(m => m.ForbiddenPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
