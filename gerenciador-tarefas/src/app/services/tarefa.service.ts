import { Injectable } from '@angular/core';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefas: Tarefa[] = [];
  private proximoId = 1;

  constructor() {
    this.carregarDoLocalStorage();
  }

  private salvarNoLocalStorage(): void {
    const tarefasPorStatus: Record<string, Tarefa[]> = {
      todo: this.tarefas.filter(t => t.status === 'pendente'),
      doing: this.tarefas.filter(t => t.status === 'fazendo'),
      done: this.tarefas.filter(t => t.status === 'concluido')
    };
    localStorage.setItem('tarefas', JSON.stringify(tarefasPorStatus));
  }

  private carregarDoLocalStorage(): void {
    const dados = localStorage.getItem('tarefas');
    if (dados) {
      const obj = JSON.parse(dados);
      this.tarefas = [...obj.todo, ...obj.doing, ...obj.done];
      this.proximoId = this.tarefas.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;
    }
  }

  listar(): Record<string, Tarefa[]> {
    const tarefasPorStatus: Record<string, Tarefa[]> = {
      todo: this.tarefas.filter(t => t.status === 'pendente'),
      doing: this.tarefas.filter(t => t.status === 'fazendo'),
      done: this.tarefas.filter(t => t.status === 'concluido')
    };
    return tarefasPorStatus;
  }

  getTarefas(): Tarefa[] {
    return this.tarefas;
  }

  adicionarTarefa(tarefa: Tarefa): void {
    tarefa.id = this.proximoId++;
    this.tarefas.push({ ...tarefa });
    this.salvarNoLocalStorage();
  }

  atualizarTarefa(tarefa: Tarefa): void {
    const index = this.tarefas.findIndex(t => t.id === tarefa.id);
    if (index !== -1) {
      this.tarefas[index] = { ...tarefa };
      this.salvarNoLocalStorage();
    }
  }

  excluirTarefa(id: number): void {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    this.salvarNoLocalStorage();
  }
}

