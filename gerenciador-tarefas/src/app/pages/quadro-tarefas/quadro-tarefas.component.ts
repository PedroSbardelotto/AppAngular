import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-quadro-tarefas',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './quadro-tarefas.component.html',
  styleUrls: ['./quadro-tarefas.component.scss']
})
export class QuadroTarefasComponent {
  pendentes: Tarefa[] = [];
  fazendo: Tarefa[] = [];
  concluido: Tarefa[] = [];

  constructor(private tarefaService: TarefaService) {
    const tarefas = this.tarefaService.listar();
    this.pendentes = tarefas.filter(t => t.status === 'pendente');
    this.fazendo = tarefas.filter(t => t.status === 'fazendo');
    this.concluido = tarefas.filter(t => t.status === 'concluido');
  }

  mover(event: any, destino: Tarefa[]) {
    const tarefa = event.item.data;
    const origem = event.previousContainer.data;

    origem.splice(event.previousIndex, 1);
    destino.splice(event.currentIndex, 0, tarefa);
  }
}
