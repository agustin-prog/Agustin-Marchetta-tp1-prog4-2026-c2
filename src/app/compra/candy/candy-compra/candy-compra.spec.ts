import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandyCompra } from './candy-compra';

describe('CandyCompra', () => {
  let component: CandyCompra;
  let fixture: ComponentFixture<CandyCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandyCompra],
    }).compileComponents();

    fixture = TestBed.createComponent(CandyCompra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
