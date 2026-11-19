import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesAdmin } from './roles-admin';

describe('RolesAdmin', () => {
  let component: RolesAdmin;
  let fixture: ComponentFixture<RolesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
