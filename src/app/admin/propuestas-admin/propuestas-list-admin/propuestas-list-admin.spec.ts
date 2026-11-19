import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropuestasListAdmin } from './propuestas-list-admin';

describe('PropuestasListAdmin', () => {
  let component: PropuestasListAdmin;
  let fixture: ComponentFixture<PropuestasListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropuestasListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PropuestasListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
