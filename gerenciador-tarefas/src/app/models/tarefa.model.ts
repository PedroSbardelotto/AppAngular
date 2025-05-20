export interface Tarefa {
  id: number;
  nome: string;
  descricao: string;
  validade: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'fazendo' | 'concluido';
  vencimento: string;
}