import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, from } from 'rxjs';
import { AuthService } from '../../../../core/services/firebase/auth';
import { UserProfile } from '../../../../core/interfaces/user-profile.interface';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './AdminComponetPage.html',
})
export class AdminPanelComponent {
  private firestore = inject(Firestore);
  public authService = inject(AuthService); // Public para usarlo en el HTML

  // Trigger para recargar la lista manualmente si fuera necesario
  // (Aunque Firestore actualiza en tiempo real, esto ayuda a la estructura rxResource)
  private reloadTrigger = signal(0);

  /**
   * RECURSO: Carga la lista de usuarios en tiempo real
   */
  usersResource = rxResource({
    params: () => ({ reload: this.reloadTrigger() }),
    stream: () => {
      const usersCollection = collection(this.firestore, 'users');
      // collectionData devuelve un Observable que se actualiza solo cuando cambia la DB
      return collectionData(usersCollection, { idField: 'uid' }) as Observable<UserProfile[]>;
    }
  });

  /**
   * ACCIÓN: Cambiar el rol de un usuario
   */
  toggleRole(user: UserProfile) {
    // 1. Evitar quitarse el admin a uno mismo (seguridad básica UI)
    if (user['uid'] === this.authService.currentUser()?.uid) {
      alert('No puedes cambiar tu propio rol.');
      return;
    }

    // 2. Determinar el nuevo rol
    const newRole = user['role'] === 'admin' ? 'user' : 'admin';
    const actionName = newRole === 'admin' ? 'ASCENDER' : 'DEGRADAR';

    // 3. Confirmación
    if (!confirm(`¿Estás seguro de ${actionName} a ${user.email}?`)) return;

    // 4. Actualizar en Firestore
    const userDocRef = doc(this.firestore, 'users', user.uid);
    
    from(updateDoc(userDocRef, { role: newRole })).subscribe({
      next: () => {
        // Éxito: No hace falta alertar mucho, la UI cambiará sola gracias a Firestore
        console.log(`Rol actualizado a ${newRole}`);
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar rol: Posiblemente falta de permisos en firestore.rules');
      }
    });
  }
}