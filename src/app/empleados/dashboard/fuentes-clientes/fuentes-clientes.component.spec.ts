import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuentesClientesComponent } from './fuentes-clientes.component';

describe('FuentesClientesComponent', () => {
  let component: FuentesClientesComponent;
  let fixture: ComponentFixture<FuentesClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuentesClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuentesClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
