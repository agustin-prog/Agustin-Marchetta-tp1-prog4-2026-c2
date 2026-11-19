import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecompensasFormAdmin } from './recompensas-form-admin';

describe('RecompensasFormAdmin', () => {
  let component: RecompensasFormAdmin;
  let fixture: ComponentFixture<RecompensasFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecompensasFormAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(RecompensasFormAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
