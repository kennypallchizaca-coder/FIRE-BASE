import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  imports: [RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-error">403</h1>
        <h2 class="text-3xl font-semibold mt-4">Acceso Denegado</h2>
        <p class="text-lg mt-2 text-base-content/70">
          No tienes permisos para acceder a esta página.
        </p>
        <div class="mt-8 flex gap-4 justify-center">
          <a routerLink="/home" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al inicio
          </a>
          <button (click)="goBack()" class="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Atrás
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ForbiddenPage {
  constructor(private router: Router) {}

  goBack() {
    window.history.back();
  }
}
