import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CombosFormAdmin } from './combos-form-admin';

describe('CombosFormAdmin', () => {
  let component: CombosFormAdmin;
  let fixture: ComponentFixture<CombosFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombosFormAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(CombosFormAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
