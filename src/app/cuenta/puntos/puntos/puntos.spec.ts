import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaPuntos } from './puntos';

describe('Puntos', () => {
  let component: CuentaPuntos;
  let fixture: ComponentFixture<CuentaPuntos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaPuntos],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentaPuntos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
