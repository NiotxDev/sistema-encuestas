import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetasResumenComponent } from './tarjetas-resumen.component';

describe('TarjetasResumenComponent', () => {
  let component: TarjetasResumenComponent;
  let fixture: ComponentFixture<TarjetasResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TarjetasResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetasResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
