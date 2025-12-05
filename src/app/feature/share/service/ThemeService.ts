import { effect, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'app-theme';
  private readonly DEFAULT_THEME = 'light';

  constructor() {}

  // Guardar en LocalStorage
  saveTheme(theme: string): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.warn('No se pudo guardar el tema', error);
    }
  }

  // Leer el tema guardado
  getTheme(): string {
    try {
      return localStorage.getItem(this.THEME_KEY) || this.DEFAULT_THEME;
    } catch (error) {
      console.warn('No se pudo obtener el tema', error);
      return this.DEFAULT_THEME;
    }
  }

  // Aplicar tema a <html>
  applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Inicializar tema (se llama al iniciar la app)
  initTheme(): void {
    const theme = this.getTheme();
    this.applyTheme(theme);
  }
}
