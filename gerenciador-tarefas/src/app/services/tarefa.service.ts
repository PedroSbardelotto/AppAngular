import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefasSubject: BehaviorSubject<Tarefa[]>;
  public tarefas$: Observable<Tarefa[]>;
  private proximoId = 1;

  private readonly localStorageKey = 'minhas-tarefas-app';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Inicializa o Subject com um array vazio primeiro.
    this.tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
    this.tarefas$ = this.tarefasSubject.asObservable();
    
    // Carrega os dados do localStorage DEPOIS que tudo foi inicializado.
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Serviço: Tentando carregar dados do localStorage...');
      const dadosSalvos = localStorage.getItem(this.localStorageKey);
      let tarefasCarregadas: Tarefa[] = [];

      if (dadosSalvos) {
        tarefasCarregadas = JSON.parse(dadosSalvos);
        console.log('Serviço: Dados carregados do localStorage.', tarefasCarregadas);
      } else {
        // Se não houver dados salvos, usa a lista inicial.
        tarefasCarregadas = [
          { id: 1, nome: 'Configurar ambiente de dev', descricao: 'Instalar Node, Angular CLI e VSCode', validade: '2025-07-10', prioridade: 'alta', status: 'Fazendo', tipo: 'Task DEV' },
          { id: 2, nome: 'Criar componentes iniciais', descricao: 'Componente de login, navbar e quadro', validade: '2025-07-11', prioridade: 'media', status: 'To Do', tipo: 'Task DEV' },
          { id: 3, nome: 'Corrigir bug no layout', descricao: 'O footer não está alinhado', validade: '2025-07-12', prioridade: 'alta', status: 'To Do', tipo: 'Bug Produção' }
        ];
        console.log('Serviço: Nenhum dado encontrado. Usando dados iniciais.');
        // Salva os dados iniciais pela primeira vez
        this.salvarDados(tarefasCarregadas);
      }
      
      // Calcula o próximo ID e emite os dados carregados para todos os componentes.
      this.proximoId = tarefasCarregadas.length > 0 ? Math.max(...tarefasCarregadas.map(t => t.id!)) + 1 : 1;
      this.tarefasSubject.next(tarefasCarregadas);
    }
  }

  private salvarDados(tarefas: Tarefa[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(tarefas));
      console.log('Serviço: Dados salvos no localStorage.');
    }
  }

  adicionarTarefa(tarefa: Tarefa): void {
    const tarefasAtuais = this.tarefasSubject.getValue();
    tarefa.id = this.proximoId++;
    const novasTarefas = [...tarefasAtuais, tarefa];
    this.tarefasSubject.next(novasTarefas);
    this.salvarDados(novasTarefas);
    console.log('Serviço: Tarefa adicionada.', tarefa);
  }

  atualizarTarefa(tarefaAtualizada: Tarefa): void {
    const tarefasAtuais = this.tarefasSubject.getValue();
    const index = tarefasAtuais.findIndex(t => t.id === tarefaAtualizada.id);
    if (index !== -1) {
      const novasTarefas = [...tarefasAtuais];
      novasTarefas[index] = tarefaAtualizada;
      this.tarefasSubject.next(novasTarefas);
      this.salvarDados(novasTarefas);
      console.log('Serviço: Tarefa atualizada.', tarefaAtualizada);
    }
  }

  excluirTarefa(id: number): void {
    const tarefasAtuais = this.tarefasSubject.getValue();
    const novasTarefas = tarefasAtuais.filter(t => t.id !== id);
    this.tarefasSubject.next(novasTarefas);
    this.salvarDados(novasTarefas);
    console.log('Serviço: Tarefa excluída. ID:', id);
  }
}