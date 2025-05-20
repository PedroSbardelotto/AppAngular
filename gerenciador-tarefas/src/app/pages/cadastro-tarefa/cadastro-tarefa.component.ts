import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-cadastro-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TarefaService],
  templateUrl: './cadastro-tarefa.component.html',
  styleUrls: ['./cadastro-tarefa.component.css']
})
export class CadastroTarefaComponent {
  tarefa: Tarefa = {
    id: 0,
    nome: '',
    descricao: '',
    validade: '',
    prioridade: 'media'
  };

  tarefas: Tarefa[] = [];
  editando: boolean = false;

  constructor(private tarefaService: TarefaService) {}

  salvarTarefa(): void {
    if (this.editando) {
      this.tarefaService.atualizarTarefa(this.tarefa);
    } else {
      this.tarefaService.adicionarTarefa(this.tarefa);
    }

    this.tarefa = {
      id: 0,
      nome: '',
      descricao: '',
      vencimento: '',
      prioridade: 'media'
    };

    this.editando = false;
    this.tarefas = this.tarefaService.getTarefas();
  }

  editarTarefa(t: Tarefa): void {
    this.tarefa = { ...t };
    this.editando = true;
  }

  excluirTarefa(id: number): void {
    this.tarefaService.excluirTarefa(id);
    this.tarefas = this.tarefaService.getTarefas();
  }

  ngOnInit(): void {
    this.tarefas = this.tarefaService.getTarefas();
  }
}
