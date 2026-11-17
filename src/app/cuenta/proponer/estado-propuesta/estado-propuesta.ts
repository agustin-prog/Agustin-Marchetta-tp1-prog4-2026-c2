import { Component, inject } from '@angular/core';
import { EstadoPropuesta as Estado, PropuestaStore } from '../../../propuesta/propuesta.store';
import { FechaPipe } from '../../../pipes/pipe-fecha/fecha-pipe';

@Component({
  imports: [FechaPipe],
  selector: 'app-estado-propuesta',
  styleUrl: './estado-propuesta.css',
  templateUrl: './estado-propuesta.html',
})
export class EstadoPropuesta {

  private readonly store = inject(PropuestaStore);
  protected readonly propuestas = this.store.mias;

  protected etiqueta(estado: Estado): string {
    return { pendiente: "Pendiente", aceptada: "Aceptada", rechazada: "Rechazada" }[estado];
  }

  constructor() {
    this.store.cargarMias().catch((error) => console.error("Error cargando propuestas", error));
  }
}