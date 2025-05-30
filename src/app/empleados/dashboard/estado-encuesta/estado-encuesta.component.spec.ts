import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoEncuestaComponent } from './estado-encuesta.component';

describe('EstadoEncuestaComponent', () => {
  let component: EstadoEncuestaComponent;
  let fixture: ComponentFixture<EstadoEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoEncuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
