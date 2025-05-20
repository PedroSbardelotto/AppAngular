import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private router: Router) {
    // Se já estiver logado, redireciona
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/inicio']);
    }
  }

  login() {
    //  login fixo
    if (this.email === 'admin@teste.com' && this.senha === '123456') {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({ email: this.email }));
      this.router.navigate(['/inicio']);
    } else {
      this.erro = 'E-mail ou senha inválidos';
    }
  }
}

