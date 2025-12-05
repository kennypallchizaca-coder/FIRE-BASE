import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { AuthService } from '../../../core/services/firebase/auth';
import { Favorite } from '../interfaces/Favorite-interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
   private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  favorites = signal<Favorite[]>([]);
  loading = signal(false);

  /**
   * Agregar un favorito a Firestore
   */
  addFavorite(nombre: string, image: string, customName?: string): Observable<any> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const favorite: Omit<Favorite, 'id'> = {
      nombre,
      customName: customName || nombre,
      image,
      userId: user.uid,
      createdAt: new Date()
    };

    const favoritesCollection = collection(this.firestore, 'favorites');
    return from(addDoc(favoritesCollection, {
      ...favorite,
      createdAt: Timestamp.fromDate(favorite.createdAt)
    }));
  }

  /**
   * Obtener todos los favoritos del usuario actual
   */
  getFavorites(): Observable<Favorite[]> {
    const user = this.authService.currentUser();
    
    if (!user) {
      return from([[]]);
    }

    this.loading.set(true);
    
    const favoritesCollection = collection(this.firestore, 'favorites');
    const q = query(favoritesCollection, where('userId', '==', user.uid));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const favorites = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt'].toDate()
        } as Favorite));
        
        this.favorites.set(favorites);
        this.loading.set(false);
        return favorites;
      })
    );
  }

  /**
   * Actualizar el nombre personalizado de un favorito
   */
  updateFavorite(id: string, customName: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(updateDoc(favoriteDoc, { customName }));
  }

  /**
   * Eliminar un favorito
   */
  deleteFavorite(id: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(deleteDoc(favoriteDoc));
  }

  /**
   * Verificar si un personaje ya es favorito
   */
  isFavorite(nombre: string): boolean {
    return this.favorites().some(fav => fav.nombre === nombre);
  }
}
