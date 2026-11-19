import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionListAdmin } from './funcion-list-admin';

describe('FuncionListAdmin', () => {
  let component: FuncionListAdmin;
  let fixture: ComponentFixture<FuncionListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
