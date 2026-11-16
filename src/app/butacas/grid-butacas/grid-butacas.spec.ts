import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridButacas } from './grid-butacas';

describe('GridButacas', () => {
  let component: GridButacas;
  let fixture: ComponentFixture<GridButacas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridButacas],
    }).compileComponents();

    fixture = TestBed.createComponent(GridButacas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
