import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuponesFormAdmin } from './cupones-form-admin';

describe('CuponesFormAdmin', () => {
  let component: CuponesFormAdmin;
  let fixture: ComponentFixture<CuponesFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuponesFormAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(CuponesFormAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
