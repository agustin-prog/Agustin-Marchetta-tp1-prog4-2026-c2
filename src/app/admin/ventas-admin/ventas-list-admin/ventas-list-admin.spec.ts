import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasListAdmin } from './ventas-list-admin';

describe('VentasListAdmin', () => {
  let component: VentasListAdmin;
  let fixture: ComponentFixture<VentasListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(VentasListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
