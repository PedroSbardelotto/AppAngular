import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroTarefaComponent } from './pages/cadastro-tarefa/cadastro-tarefa.component';
import { QuadroTarefasComponent } from './pages/quadro-tarefas/quadro-tarefas.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'tarefas', component: CadastroTarefaComponent },
  { path: 'inicio', component: CadastroTarefaComponent},
  { path: 'quadro', component: QuadroTarefasComponent }

];