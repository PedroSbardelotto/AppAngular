import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  return authService.user$.pipe(
    take(1),
    map(user => {
      
      const isLoggedIn = !!user;
      
      if (isLoggedIn) {
        return true; 
      } else {
        // Se não estiver logado, redireciona para o login e bloqueia a rota
        router.navigate(['/login']);
        return false;
      }
    })
  );
};