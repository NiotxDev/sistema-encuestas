import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEncuestasComponent } from './lista-encuestas.component';

describe('ListaEncuestasComponent', () => {
  let component: ListaEncuestasComponent;
  let fixture: ComponentFixture<ListaEncuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaEncuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
