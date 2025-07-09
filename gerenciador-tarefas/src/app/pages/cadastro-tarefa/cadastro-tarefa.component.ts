import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';
import { FilterTarefaPipe } from '../../pipes/filter-tarefa.pipe';

@Component({
  selector: 'app-cadastro-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterTarefaPipe ],
  providers: [],
  templateUrl: './cadastro-tarefa.component.html',
  styleUrls: ['./cadastro-tarefa.component.css']
})
export class CadastroTarefaComponent implements OnInit {
  tarefa: Tarefa = this.novaTarefa();
  tarefas: Tarefa[] = [];
  editando: boolean = false;
  prioridadeFiltro: string = 'todas';

  constructor(private tarefaService: TarefaService) {}

  novaTarefa(): Tarefa {
    return {
      id: 0,
      nome: '',
      descricao: '',
      validade: '',
      prioridade: 'media',
      status: 'pendente',
      vencimento: ''
    };
  }

  validarTarefa(tarefa: Tarefa): boolean {
    if (!tarefa.nome.trim()) {
      alert('Nome da tarefa é obrigatório.');
      return false;
    }
    if (!tarefa.descricao.trim()) {
      alert('Descrição da tarefa é obrigatória.');
      return false;
    }
    if (!tarefa.status) {
      alert('Status da tarefa é obrigatório.');
      return false;
    }
    return true;
  }

  salvarTarefa(): void {
    if (!this.validarTarefa(this.tarefa)) {
      return;
    }

    if (!this.tarefa.validade) {
      const hoje = new Date();
      const dataAtual = hoje.toISOString().split('T')[0];
      this.tarefa.validade = dataAtual;
    }

    if (this.editando) {
      this.tarefaService.atualizarTarefa(this.tarefa);
    } else {
      this.tarefaService.adicionarTarefa(this.tarefa);
    }

    this.tarefa = this.novaTarefa();
    this.editando = false;
  }

  editarTarefa(t: Tarefa): void {
    this.tarefa = { ...t };
    this.editando = true;
  }

  excluirTarefa(id: number): void {
    this.tarefaService.excluirTarefa(id);
  }

  ngOnInit(): void {
    this.tarefaService.tarefas$.subscribe(tarefas => {
      this.tarefas = tarefas;
    });
  }
}
