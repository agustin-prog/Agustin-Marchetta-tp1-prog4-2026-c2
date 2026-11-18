import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculaCardAdmin } from './pelicula-card-admin';

describe('PeliculaCardAdmin', () => {
  let component: PeliculaCardAdmin;
  let fixture: ComponentFixture<PeliculaCardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculaCardAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculaCardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
