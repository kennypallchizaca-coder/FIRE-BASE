import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, map, switchMap } from 'rxjs';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const db = inject(Firestore);
    const router = inject(Router);

    return authState(auth).pipe(
      switchMap(user => {
        if (!user) {
          router.navigate(['/auth/login']);
          return from([false]);
        }

        const userRef = doc(db, 'users', user.uid);
        return from(getDoc(userRef)).pipe(
          map(snapshot => {
            const data = snapshot.data();
            const role = data?.['role'];

            if (role === requiredRole) return true;

            router.navigate(['/unauthorized']);
            return false;
          })
        );
      })
    );
  };
};
