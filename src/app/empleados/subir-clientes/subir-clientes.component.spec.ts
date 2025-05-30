import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirClientesComponent } from './subir-clientes.component';

describe('SubirClientesComponent', () => {
  let component: SubirClientesComponent;
  let fixture: ComponentFixture<SubirClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubirClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
