import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromocionesNavAdmin } from './promociones-nav-admin';

describe('PromocionesNavAdmin', () => {
  let component: PromocionesNavAdmin;
  let fixture: ComponentFixture<PromocionesNavAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesNavAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PromocionesNavAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
