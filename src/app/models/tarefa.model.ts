export interface Tarefa {
  id?: number;
  nome: string;
  descricao: string;
  validade: string | null;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'To Do' | 'Fazendo' | 'Concluído';
  tipo: string | null;
  created_at?: string;
}