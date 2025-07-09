import { TestBed } from '@angular/core/testing';

import { TipoTarefaService } from './tipo-tarefa.service';

describe('TipoTarefaService', () => {
  let service: TipoTarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoTarefaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
