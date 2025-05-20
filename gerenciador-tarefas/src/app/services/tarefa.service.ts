import { Injectable } from '@angular/core';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefas: Tarefa[] = [];
  private proximoId = 1;

  constructor() { }

  getTarefas(): Tarefa[] {
    return this.tarefas;
  }

  listar(): Tarefa[] {
    return [...this.tarefas];
  }
  adicionarTarefa(tarefa: Tarefa): void {
    tarefa.id = this.proximoId++;
    this.tarefas.push({ ...tarefa });
  }

  atualizarTarefa(tarefa: Tarefa): void {
    const index = this.tarefas.findIndex(t => t.id === tarefa.id);
    if (index !== -1) {
      this.tarefas[index] = { ...tarefa };
    }
  }

  excluirTarefa(id: number): void {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
  }
}
