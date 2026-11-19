import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosFormAdmin } from './productos-form-admin';

describe('ProductosFormAdmin', () => {
  let component: ProductosFormAdmin;
  let fixture: ComponentFixture<ProductosFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosFormAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosFormAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
