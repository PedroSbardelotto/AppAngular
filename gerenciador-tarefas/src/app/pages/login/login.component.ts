import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', pass: '' };
  authMode: 'login' | 'cadastro' = 'login';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

 

  async onSubmit() {
    if (this.authMode === 'login') {
      const { error } = await this.authService.signIn(this.credentials);
      if (error) {
        alert(`Erro no login: ${error.message}`);
      } else {
        this.router.navigate(['/inicio']);
      }
    } else {
      const { error } = await this.authService.signUp(this.credentials);
      if (error) {
        alert(`Erro no cadastro: ${error.message}`);
      } else {
        alert('Cadastro realizado com sucesso! Por favor, faça o login.');
        this.authMode = 'login';
      }
    }
  }

  switchMode() {
    this.authMode = this.authMode === 'login' ? 'cadastro' : 'login';
  }
}