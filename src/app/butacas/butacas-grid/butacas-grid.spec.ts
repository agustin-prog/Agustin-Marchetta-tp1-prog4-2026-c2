import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButacasGrid } from './butacas-grid';

describe('ButacasGrid', () => {
  let component: ButacasGrid;
  let fixture: ComponentFixture<ButacasGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButacasGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(ButacasGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
