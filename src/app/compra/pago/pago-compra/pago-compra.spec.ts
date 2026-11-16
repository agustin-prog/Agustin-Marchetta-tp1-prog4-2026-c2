import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoCompra } from './pago-compra';

describe('PagoCompra', () => {
  let component: PagoCompra;
  let fixture: ComponentFixture<PagoCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoCompra],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoCompra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
