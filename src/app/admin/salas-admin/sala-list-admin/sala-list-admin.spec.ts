import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaListAdmin } from './sala-list-admin';

describe('SalaListAdmin', () => {
  let component: SalaListAdmin;
  let fixture: ComponentFixture<SalaListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
