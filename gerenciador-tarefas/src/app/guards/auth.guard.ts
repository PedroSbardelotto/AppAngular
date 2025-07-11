import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);

  
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  
  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true; 
      }
      
      
      router.navigate(['/login']);
      return false;
    })
  );
};