import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaMisPeliculas } from './mis-peliculas';

describe('MisPeliculas', () => {
  let component: CuentaMisPeliculas;
  let fixture: ComponentFixture<CuentaMisPeliculas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaMisPeliculas],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentaMisPeliculas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
