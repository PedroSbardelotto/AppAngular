import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  editando: boolean = false;
  prioridadeFiltro: string = 'todas';


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
      validade: '',
      prioridade: 'media',
      status: 'To Do',
      tipo: null,
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
    if (!tarefa.tipo) {
      alert('O tipo da tarefa é obrigatório.');
      return false;
    }
    return true;
  }

  salvarTarefa(): void {
    if (!this.validarTarefa(this.tarefa)) {
      return;
    }

    if (this.editando) {
      this.tarefaService.atualizarTarefa(this.tarefa);
    } else {
      this.tarefaService.adicionarTarefa({ ...this.tarefa });
    }

    this.editando = false;
    this.form.resetForm();
  }

  editarTarefa(t: Tarefa): void {
    this.tarefa = JSON.parse(JSON.stringify(t));
    this.editando = true;
  }

  excluirTarefa(id: number | undefined): void {
    if (id !== undefined) {
      this.tarefaService.excluirTarefa(id);
    }
  }
}