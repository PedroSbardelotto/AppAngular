import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  email = '';
  senha = '';
  erro = ' ';
  constructor(
    private router: Router,
   
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(): void {
    
    if (this.email === 'aluno@senac.com' && this.senha === '123456') {
      
      
      if (isPlatformBrowser(this.platformId)) {
        
        const fakeToken = btoa(`${this.email}:${this.senha}`);
        localStorage.setItem('token', fakeToken);
        
        
        this.router.navigate(['/inicio']);
      }

    } else {
      alert('E-mail ou senha inválidos.');
    }
  }
}