import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoPropuesta } from './estado-propuesta';

describe('EstadoPropuesta', () => {
  let component: EstadoPropuesta;
  let fixture: ComponentFixture<EstadoPropuesta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoPropuesta],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadoPropuesta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
