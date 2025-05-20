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

  listas: [string, Tarefa[]][] = [];

  constructor(private tarefaService: TarefaService) {
    const tarefasPorStatus = this.tarefaService.listar();
    this.pendentes = tarefasPorStatus['todo'];
    this.fazendo = tarefasPorStatus['doing'];
    this.concluido = tarefasPorStatus['done'];


    this.listas = [
      ['To Do', this.pendentes],
      ['Fazendo', this.fazendo],
      ['Concluído', this.concluido]
    ];
  }

  mover(event: any, destino: Tarefa[]) {
    const tarefa: Tarefa = event.item.data;
    const origem = event.previousContainer.data;

    if (Array.isArray(origem) && Array.isArray(destino)) {
      origem.splice(event.previousIndex, 1);
      destino.splice(event.currentIndex, 0, tarefa);

      // Atualiza o status da tarefa com base no destino
      const novaLista = this.listas.find(([_, lista]) => lista === destino);
      if (novaLista) {
        const novoStatus = novaLista[0];
        tarefa.status = novoStatus === 'pendente' ? 'pendente' :
          novoStatus === 'fazendo' ? 'fazendo' : 'concluido';
        this.tarefaService.atualizarTarefa(tarefa);
      }
    }
  }
}
