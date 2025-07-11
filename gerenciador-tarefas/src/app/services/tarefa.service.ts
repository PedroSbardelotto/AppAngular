import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  public tarefas$ = this.tarefasSubject.asObservable();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.carregarTarefasIniciais();
  }

  private async executeOnBrowser<T>(action: (supabase: any) => Promise<any>): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        await action(this.authService.supabase);
      } catch (error) {
        console.error("Erro na operação do TarefaService:", error);
      }
    }
  }

  carregarTarefasIniciais() {
    this.executeOnBrowser(async (supabase) => {
      const { data, error } = await supabase.from('tarefas').select('*').order('id');
      if (error) throw error;
      this.tarefasSubject.next(data || []);
    });
  }

  adicionarTarefa(tarefa: Omit<Tarefa, 'id' | 'created_at'>) {
    this.executeOnBrowser(async (supabase) => {
      const { error } = await supabase.from('tarefas').insert(tarefa);
      if (error) throw error;
      this.carregarTarefasIniciais(); // Recarrega a lista
    });
  }

  atualizarTarefa(tarefa: Tarefa) {
    this.executeOnBrowser(async (supabase) => {
      const { id, created_at, ...updateData } = tarefa;
      const { error } = await supabase.from('tarefas').update(updateData).eq('id', id);
      if (error) throw error;
      this.carregarTarefasIniciais();
    });
  }

  excluirTarefa(id: number) {
    this.executeOnBrowser(async (supabase) => {
      const { error } = await supabase.from('tarefas').delete().eq('id', id);
      if (error) throw error;
      this.carregarTarefasIniciais();
    });
  }
}