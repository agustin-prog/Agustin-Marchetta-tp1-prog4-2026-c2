import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculaListAdmin } from './pelicula-list-admin';

describe('PeliculaListAdmin', () => {
  let component: PeliculaListAdmin;
  let fixture: ComponentFixture<PeliculaListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculaListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculaListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
