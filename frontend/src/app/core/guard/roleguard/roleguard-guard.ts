import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../Auth/auth-service';
import { filter, map, switchMap, take } from 'rxjs';

export const roleguardGuard: CanActivateFn = (route, state) => {
  const authServ = inject(AuthService);
  const router = inject(Router);

  return authServ.isInitialized$.pipe(
    // 1. Wait until the AuthService has finished loading/initializing
    filter(initialized => initialized === true),
    
    // 2. Switch to the current user stream
    switchMap(() => authServ.currentUser$),
    
    // 3. Take only the first value and complete (prevents memory leaks)
    take(1),
    
    // 4. Perform the Role Check
    map(user => {
      console.log('Role Guard checking user:', user);

      // Check if user exists AND has the 'admin' role
      if (user && user.role === 'admin') {
        return true; 
      } else {
        // If not admin, redirect to unauthorized page or dashboard
        console.warn('Access denied: User is not an admin');
        return router.createUrlTree(['/unauthorized']); 
      }
    })
  );
};
