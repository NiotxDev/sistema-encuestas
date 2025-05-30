import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenFechasComponent } from './resumen-fechas.component';

describe('ResumenFechasComponent', () => {
  let component: ResumenFechasComponent;
  let fixture: ComponentFixture<ResumenFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumenFechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
