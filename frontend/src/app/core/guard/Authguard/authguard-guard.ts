import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../Auth/auth-service';
import { filter, map, switchMap, take } from 'rxjs';

export const AuthGuard :CanActivateFn = (Route, state) =>{


    const AuthServ = inject(AuthService)
    const router = inject(Router)

  return AuthServ.isInitialized$.pipe(
    filter(initialized => initialized === true),
    switchMap(() => AuthServ.currentUser$),
    take(1),
    map(user => {
      if (user) {
        console.log(user);
        return true;
      } else {
        // Redirect to login if no user is found
        return router.createUrlTree(['/auth/login']);
      }
    })
  );
}