import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaSeleccionButacas } from './vista-seleccion-butacas';

describe('VistaSeleccionButacas', () => {
  let component: VistaSeleccionButacas;
  let fixture: ComponentFixture<VistaSeleccionButacas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaSeleccionButacas],
    }).compileComponents();

    fixture = TestBed.createComponent(VistaSeleccionButacas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
