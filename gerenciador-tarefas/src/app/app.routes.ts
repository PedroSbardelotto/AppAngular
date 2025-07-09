import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroTarefaComponent } from './pages/cadastro-tarefa/cadastro-tarefa.component';
import { QuadroTarefasComponent } from './pages/quadro-tarefas/quadro-tarefas.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },


  {
    path: 'inicio',
    component: CadastroTarefaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'quadro',
    component: QuadroTarefasComponent,
    canActivate: [authGuard]
  },

  // Rota de fallback, caso o usuário digite uma URL que não existe
  { path: '**', redirectTo: '/login' }
];  