import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadroTarefasComponent } from './quadro-tarefas.component';

describe('QuadroTarefasComponent', () => {
  let component: QuadroTarefasComponent;
  let fixture: ComponentFixture<QuadroTarefasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadroTarefasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadroTarefasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
