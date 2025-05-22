import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  public tarefas$: Observable<Tarefa[]> = this.tarefasSubject.asObservable();

  private tarefas: Tarefa[] = [
    { id: 1, nome: 'Exemplo 1', descricao: 'Descrição 1', validade: '2025-01-01', prioridade: 'media', status: 'pendente', vencimento: '' },
    { id: 2, nome: 'Exemplo 2', descricao: 'Descrição 2', validade: '2025-02-01', prioridade: 'alta', status: 'fazendo', vencimento: '' },
    { id: 3, nome: 'Exemplo 3', descricao: 'Descrição 3', validade: '2025-03-01', prioridade: 'baixa', status: 'concluido', vencimento: '' },
  ];

  constructor() {
    this.atualizarStream();
  }

  private atualizarStream() {
    this.tarefasSubject.next([...this.tarefas]);
  }

  adicionarTarefa(tarefa: Tarefa): void {
    tarefa.id = this.tarefas.length + 1;
    this.tarefas.push(tarefa);
    this.atualizarStream();
  }

  atualizarTarefa(tarefa: Tarefa): void {
    const index = this.tarefas.findIndex(t => t.id === tarefa.id);
    if (index >= 0) {
      this.tarefas[index] = tarefa;
      this.atualizarStream();
    }
  }

  excluirTarefa(id: number): void {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    this.atualizarStream();
  }

  listar(): { [key: string]: Tarefa[] } {
    return {
      todo: this.tarefas.filter(t => t.status === 'pendente'),
      doing: this.tarefas.filter(t => t.status === 'fazendo'),
      done: this.tarefas.filter(t => t.status === 'concluido')
    };
  }
}