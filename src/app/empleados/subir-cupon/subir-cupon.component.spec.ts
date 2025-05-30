import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirCuponComponent } from './subir-cupon.component';

describe('SubirCuponComponent', () => {
  let component: SubirCuponComponent;
  let fixture: ComponentFixture<SubirCuponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubirCuponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirCuponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
