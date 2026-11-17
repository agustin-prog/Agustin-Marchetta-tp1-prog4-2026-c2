import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEdad } from './modal-edad';

describe('Modal', () => {
  let component: ModalEdad;
  let fixture: ComponentFixture<ModalEdad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEdad],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEdad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
