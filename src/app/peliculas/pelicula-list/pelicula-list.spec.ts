import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculaList } from './pelicula-list';

describe('PeliculaList', () => {
  let component: PeliculaList;
  let fixture: ComponentFixture<PeliculaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculaList],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
