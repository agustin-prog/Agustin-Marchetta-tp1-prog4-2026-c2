import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProponerPelicula } from './proponer-pelicula';

describe('ProponerPelicula', () => {
  let component: ProponerPelicula;
  let fixture: ComponentFixture<ProponerPelicula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProponerPelicula],
    }).compileComponents();

    fixture = TestBed.createComponent(ProponerPelicula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
