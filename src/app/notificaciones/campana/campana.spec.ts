import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Campana } from './campana';

describe('Campana', () => {
  let component: Campana;
  let fixture: ComponentFixture<Campana>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campana],
    }).compileComponents();

    fixture = TestBed.createComponent(Campana);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
