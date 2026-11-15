import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorPeliculas } from './buscador-peliculas';

describe('BuscadorPeliculas', () => {
  let component: BuscadorPeliculas;
  let fixture: ComponentFixture<BuscadorPeliculas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorPeliculas],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorPeliculas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
