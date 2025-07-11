import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Tarefa } from '../../models/tarefa.model';
import { TarefaService } from '../../services/tarefa.service';


interface Coluna {
  id: 'To Do' | 'Fazendo' | 'Concluído';
  titulo: string;
  tarefas: Tarefa[];
  cor: string;
}

@Component({
  selector: 'app-quadro-tarefas',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './quadro-tarefas.component.html',
})
export class QuadroTarefasComponent implements OnInit {

  colunas: Coluna[] = [
    { id: 'To Do', titulo: 'To Do', tarefas: [], cor: 'bg-primary' },
    { id: 'Fazendo', titulo: 'Fazendo', tarefas: [], cor: 'bg-warning text-dark' },
    { id: 'Concluído', titulo: 'Concluído', tarefas: [], cor: 'bg-success' }
  ];

  
  constructor(private tarefaService: TarefaService) { }

  ngOnInit(): void {
    this.tarefaService.tarefas$.subscribe(tarefas => {
      
      this.colunas.forEach(col => col.tarefas = []);

      
      tarefas.forEach(tarefa => {
        const coluna = this.colunas.find(c => c.id === tarefa.status);
        if (coluna) {
          coluna.tarefas.push(tarefa);
        }
      });
    });
  }

  drop(event: CdkDragDrop<Tarefa[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const tarefaMovida = event.previousContainer.data[event.previousIndex];
      const novoStatus = event.container.id as 'To Do' | 'Fazendo' | 'Concluído';

      tarefaMovida.status = novoStatus;
      this.tarefaService.atualizarTarefa(tarefaMovida);
    }
  }

  
  
  
  getBadgeClass(prioridade: string): string {
    switch (prioridade) {
      case 'alta': return 'badge bg-danger';
      case 'media': return 'badge bg-warning text-dark';
      case 'baixa': return 'badge bg-info text-dark';
      default: return 'badge bg-secondary';
    }
  }
}