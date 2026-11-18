import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandyNavAdmin } from './candy-nav-admin';

describe('CandyNavAdmin', () => {
  let component: CandyNavAdmin;
  let fixture: ComponentFixture<CandyNavAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandyNavAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(CandyNavAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
