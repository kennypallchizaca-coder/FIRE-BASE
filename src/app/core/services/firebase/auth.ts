import { inject, Injectable, signal } from '@angular/core';
import { from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Auth, user, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { UserProfile } from '../../interfaces/user-profile.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  
  // Signal para el usuario actual
  currentUser = signal<User | null>(null);
  
  // Observable del estado de autenticación
  user$ = user(this.auth);

  

  /**
   * Registrar nuevo usuario con email y password
   */
  register(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }

  /**
   * Login con email y password
   */
  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }

  /**
   * Login con Google
   */
//   loginWithGoogle(): Observable<any> {
//     const provider = new GoogleAuthProvider();
//     const promise = signInWithPopup(this.auth, provider);
//     return from(promise);
//   }

  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }

  /**
   * Verificar si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

 
  private firestore: Firestore = inject(Firestore);
  
  
  userProfile = signal<UserProfile | null>(null);

  constructor() {
    this.user$.subscribe(async user => {
      console.log('🔄 AuthService: Estado de autenticación cambió:', user ? user.email : 'No autenticado');
      this.currentUser.set(user);
      
      if (user) {
        console.log('👤 Usuario autenticado:', user.uid, user.email);
        // Cargar perfil del usuario desde Firestore
        try {
          const profileDoc = await getDoc(
            doc(this.firestore, 'users', user.uid)
          );
          
          if (profileDoc.exists()) {
            this.userProfile.set(profileDoc.data() as UserProfile);
            console.log('✅ Perfil de usuario cargado:', this.userProfile());
          } else {
            console.log('⚠️ No se encontró perfil en Firestore para:', user.uid);
          }
        } catch (error) {
          console.error('❌ Error al cargar perfil de usuario:', error);
        }
      } else {
        console.log('🚪 Usuario cerró sesión');
        this.userProfile.set(null);
      }
    });
  }

  hasRole(role: string): boolean {
    const profile = this.userProfile();
    return profile?.['role'] === role;
  }
}

