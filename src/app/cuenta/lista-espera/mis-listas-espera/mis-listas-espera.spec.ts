import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisListasEspera } from './mis-listas-espera';

describe('MisListasEspera', () => {
  let component: MisListasEspera;
  let fixture: ComponentFixture<MisListasEspera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisListasEspera],
    }).compileComponents();

    fixture = TestBed.createComponent(MisListasEspera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
