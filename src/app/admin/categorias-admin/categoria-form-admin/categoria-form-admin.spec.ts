import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaFormAdmin } from './categoria-form-admin';

describe('CategoriaFormAdmin', () => {
  let component: CategoriaFormAdmin;
  let fixture: ComponentFixture<CategoriaFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaFormAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaFormAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
