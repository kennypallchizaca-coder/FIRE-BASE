import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/firebase/auth';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormUtils } from '../../../FormUtils/FormUtils';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  formUtils = FormUtils;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: async (userCredential) => {
        console.log('✅ Login exitoso:', userCredential.user.email);
        
        // Esperar un momento para que se cargue el perfil del usuario
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar el rol del usuario y redirigir según corresponda
        const userProfile = this.authService.userProfile();
        let navigateTo = '/home';
        
        if (userProfile?.role === 'admin') {
          navigateTo = '/admin';
          console.log('👑 Usuario admin detectado, redirigiendo a panel de admin');
        } else {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          navigateTo = returnUrl || '/home';
          console.log('👤 Usuario regular, navegando a:', navigateTo);
        }
        
        this.loading.set(false);
        
        // Navegar a la ruta correspondiente
        this.router.navigate([navigateTo]).then(() => {
          console.log('✅ Navegación completada a:', navigateTo);
        });
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.loading.set(false);
        this.errorMessage.set(this.getErrorMessage(error.code));
      }
    });
  }

  private getErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'El usuario ha sido deshabilitado',
      'auth/user-not-found': 'No existe un usuario con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.'
    };
    return errorMessages[code] || 'Error de autenticación. Intenta nuevamente.';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
