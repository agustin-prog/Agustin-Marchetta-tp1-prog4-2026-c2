import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaEsperaAdmin } from './lista-espera-admin';

describe('ListaEsperaAdmin', () => {
  let component: ListaEsperaAdmin;
  let fixture: ComponentFixture<ListaEsperaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEsperaAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEsperaAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
