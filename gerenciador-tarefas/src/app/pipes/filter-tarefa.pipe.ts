import { Pipe, PipeTransform } from '@angular/core';
import { Tarefa } from '../models/tarefa.model';

@Pipe({
  name: 'filterTarefa',
  standalone: true
})
export class FilterTarefaPipe implements PipeTransform {

  transform(items: Tarefa[], prioridade: string): Tarefa[] {
    if (!items) {
      return [];
    }
    
    if (!prioridade || prioridade === 'todas') {
      return items;
    }

    return items.filter(tarefa => {
      return tarefa.prioridade === prioridade;
    });
  }
}