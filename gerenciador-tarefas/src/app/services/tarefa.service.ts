import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environments';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private supabase: SupabaseClient;
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  public tarefas$ = this.tarefasSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.carregarTarefasIniciais();
  }

  // Carrega todas as tarefas do banco de dados
  async carregarTarefasIniciais() {
    const { data, error } = await this.supabase
      .from('tarefas')
      .select('*')
      .order('id', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
    } else {
      this.tarefasSubject.next(data as Tarefa[] || []);
    }
  }

  // Adiciona uma nova tarefa
  async adicionarTarefa(tarefa: Tarefa) {
    // Remove o 'id' pois o banco de dados o gera automaticamente
    const { id, ...dadosDaTarefa } = tarefa;

    const { error } = await this.supabase
      .from('tarefas')
      .insert(dadosDaTarefa);

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } else {
      // Recarrega a lista para mostrar a nova tarefa
      this.carregarTarefasIniciais();
    }
  }

  // Atualiza uma tarefa existente
  async atualizarTarefa(tarefa: Tarefa) {
    const { error } = await this.supabase
      .from('tarefas')
      .update(tarefa)
      .eq('id', tarefa.id);

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } else {
      this.carregarTarefasIniciais();
    }
  }

  // Exclui uma tarefa
  async excluirTarefa(id: number) {
    const { error } = await this.supabase
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