export interface Tarefa {
  id: number;
  nome: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  validade: Date;
  status: 'pendente' | 'fazendo' | 'concluido';
  arquivada?: boolean;
}
