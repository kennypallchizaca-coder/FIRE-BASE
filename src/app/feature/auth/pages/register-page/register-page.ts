import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/firebase/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { FormUtils } from '../../../FormUtils/FormUtils';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../../core/interfaces/user-profile.interface';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {


  error = signal<string | null>(null);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  private firestore = inject(Firestore);
  loading = signal<boolean>(false);

  formUtils = FormUtils;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

 
onSubmit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.registerForm.value;
  this.loading.set(true);
  this.error.set(null);

  console.log('📝 Intentando registrar usuario:', email);

  this.authService.register(email, password).subscribe({
    next: async (userCredential) => {
      try {
        console.log('✅ Usuario creado en Firebase Auth:', userCredential.user.uid);
        
        // Crear documento de perfil en Firestore
        const userProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          role: 'user',
          displayName: userCredential.user.displayName || ''
        };

        await setDoc(
          doc(this.firestore, 'users', userCredential.user.uid),
          userProfile
        );

        console.log('✅ Perfil creado en Firestore');
        console.log('📍 Navegando a /home');
        this.loading.set(false);
        
        // Navegar inmediatamente
        this.router.navigate(['/home']).then(() => {
          console.log('✅ Navegación completada a /home');
        });
        
      } catch (firestoreError: any) {
        console.error('❌ Error al crear perfil en Firestore:', firestoreError);
        this.loading.set(false);
        this.error.set('Error al crear el perfil: ' + (firestoreError.message || 'Error desconocido'));
      }
    },
    error: (error) => {
      console.error('❌ Error al registrar usuario:', error);
      this.loading.set(false);
      
      // Si el correo ya está en uso, ofrecer ir al login
      if (error.code === 'auth/email-already-in-use') {
        this.error.set('Este correo ya está registrado. ¿Quieres iniciar sesión?');
        // Opcionalmente, redirigir automáticamente después de unos segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.error.set(this.getErrorMessage(error.code));
      }
    }
  });
}
  getErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo ya está registrado. Intenta iniciar sesión.',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'El registro está deshabilitado. Contacta al administrador.',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.'
    };
    return errorMessages[code] || `Error al registrar: ${code || 'Error desconocido'}`;
  }

get email() {
  return this.registerForm.get('email');
}

get password() {
  return this.registerForm.get('password');
}

get confirmPassword() {
  return this.registerForm.get('confirmPassword');
}
}
