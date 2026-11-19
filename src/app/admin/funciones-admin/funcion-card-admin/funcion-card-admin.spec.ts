import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionCardAdmin } from './funcion-card-admin';

describe('FuncionCardAdmin', () => {
  let component: FuncionCardAdmin;
  let fixture: ComponentFixture<FuncionCardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionCardAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionCardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
