import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
 
  const router = inject(Router);
 
  const platformId = inject(PLATFORM_ID);

  
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      
      return true;
    } else {
      
      console.log('AuthGuard: Acesso bloqueado. Redirecionando para /login');
      router.navigate(['/login']);
    
      return false;
    }
  }

 
  return false;
};