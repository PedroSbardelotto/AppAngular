import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
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

  // MÉTODO CORRIGIDO
  async adicionarTarefa(tarefa: Tarefa) {
    // Criamos um objeto novo apenas com os dados que queremos inserir.
    // Deixamos 'id' e 'created_at' de fora para o Supabase cuidar deles.
    const novaTarefa = {
      nome: tarefa.nome,
      descricao: tarefa.descricao,
      validade: tarefa.validade,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
      tipo: tarefa.tipo
    };

    const { error } = await this.supabase
      .from('tarefas')
      .insert(novaTarefa); // Enviamos o objeto limpo

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } else {
      this.carregarTarefasIniciais();
    }
  }

  async atualizarTarefa(tarefa: Tarefa) {
     // Para atualizar, o objeto precisa ter o id
    const tarefaParaAtualizar = {
      id: tarefa.id,
      nome: tarefa.nome,
      descricao: tarefa.descricao,
      validade: tarefa.validade,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
      tipo: tarefa.tipo
    };

    const { error } = await this.supabase
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