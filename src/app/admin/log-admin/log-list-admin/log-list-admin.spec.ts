import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogListAdmin } from './log-list-admin';

describe('LogListAdmin', () => {
  let component: LogListAdmin;
  let fixture: ComponentFixture<LogListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogListAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(LogListAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
