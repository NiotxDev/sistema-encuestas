import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoRespuestasComponent } from './grafico-respuestas.component';

describe('GraficoRespuestasComponent', () => {
  let component: GraficoRespuestasComponent;
  let fixture: ComponentFixture<GraficoRespuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoRespuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
