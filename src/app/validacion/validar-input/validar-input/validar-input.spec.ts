import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidarInput } from './validar-input';

describe('ValidarInput', () => {
  let component: ValidarInput;
  let fixture: ComponentFixture<ValidarInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarInput],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidarInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
