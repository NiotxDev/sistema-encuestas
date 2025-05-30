import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRespuestasComponent } from './top-respuestas.component';

describe('TopRespuestasComponent', () => {
  let component: TopRespuestasComponent;
  let fixture: ComponentFixture<TopRespuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopRespuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
