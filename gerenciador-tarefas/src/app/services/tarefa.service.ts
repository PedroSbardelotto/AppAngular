import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  public tarefas$ = this.tarefasSubject.asObservable();

  // Injetando o AuthService no construtor
  constructor(private authService: AuthService) {
    this.carregarTarefasIniciais();
  }

  
  async carregarTarefasIniciais() {
    //  conexão do AuthService
    const { data, error } = await this.authService.supabase
      .from('tarefas')
      .select('*')
      .order('id', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
    } else {
      this.tarefasSubject.next(data as Tarefa[] || []);
    }
  }

  // 
  async adicionarTarefa(tarefa: Tarefa) {
    const novaTarefa = {
      nome: tarefa.nome,
      descricao: tarefa.descricao,
      validade: tarefa.validade,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
      tipo: tarefa.tipo
    };

    //  conexão do AuthService
    const { error } = await this.authService.supabase
      .from('tarefas')
      .insert(novaTarefa);

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } else {
      this.carregarTarefasIniciais();
    }
  }

  
  async atualizarTarefa(tarefa: Tarefa) {
    const tarefaParaAtualizar = {
      id: tarefa.id,
      nome: tarefa.nome,
      descricao: tarefa.descricao,
      validade: tarefa.validade,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
      tipo: tarefa.tipo
    };

    //  conexão do AuthService
    const { error } = await this.authService.supabase
      .from('tarefas')
      .update(tarefaParaAtualizar)
      .eq('id', tarefa.id);

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } else {
      this.carregarTarefasIniciais();
    }
  }

  
  async excluirTarefa(id: number) {
    
    const { error } = await this.authService.supabase
      .from('tarefas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir tarefa:', error);
    } else {
      this.carregarTarefasIniciais();
    }
  }
}