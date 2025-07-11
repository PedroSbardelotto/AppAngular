import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';
import { FilterTarefaPipe } from '../../pipes/filter-tarefa.pipe';

@Component({
  selector: 'app-cadastro-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterTarefaPipe],
  templateUrl: './cadastro-tarefa.component.html',
  styleUrls: ['./cadastro-tarefa.component.css']
})
export class CadastroTarefaComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  tarefa: Tarefa = this.novaTarefa();
  tarefas: Tarefa[] = [];
  editando = false;
  prioridadeFiltro = 'todas';
  tiposDeTarefa: string[] = ['Chamado', 'Bug Produção', 'Task QA', 'RDM', 'Task DEV'];

  constructor(private tarefaService: TarefaService) { }

  ngOnInit(): void {
    this.tarefaService.tarefas$.subscribe(tarefas => {
      this.tarefas = tarefas;
    });
  }

  novaTarefa(): Tarefa {
    return {
      nome: '',
      descricao: '',
      validade: null,
      prioridade: 'media',
      status: 'To Do',
      tipo: null,
    };
  }

  async salvarTarefa(): Promise<void> {
    if (this.form.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const tarefaParaSalvar = { ...this.tarefa };

    try {
      if (this.editando) {
        await this.tarefaService.atualizarTarefa(tarefaParaSalvar);
      } else {
        // Removemos o 'id' e 'created_at' antes de enviar, pois são gerados pelo banco
        const { id, created_at, ...novaTarefa } = tarefaParaSalvar;
        await this.tarefaService.adicionarTarefa(novaTarefa);
      }
      this.form.resetForm(this.novaTarefa());
      this.editando = false;
    } catch (error) {
      console.error("Falha ao salvar a tarefa:", error);
    }
  }

  editarTarefa(t: Tarefa): void {
    this.tarefa = { ...t };
    this.editando = true;
  }

  async excluirTarefa(id: number | undefined): Promise<void> {
    if (id !== undefined) {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        await this.tarefaService.excluirTarefa(id);
      }
    }
  }
}