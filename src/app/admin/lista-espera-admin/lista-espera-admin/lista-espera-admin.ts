import { Component, inject, signal } from "@angular/core";
import { ListaEsperaStore } from "../../../lista-espera/lista-espera.store";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";

@Component({
  imports: [FechaPipe],
  selector: 'app-lista-espera-admin',
  styleUrl: './lista-espera-admin.css',
  templateUrl: './lista-espera-admin.html',
})
export class ListaEsperaAdmin {

  private readonly store = inject(ListaEsperaStore);
  protected readonly funciones = this.store.admin;

  protected readonly error = signal<string | null>(null);

  constructor() {
    this.store.cargarAdmin()
      .catch((error) => this.error.set(error instanceof Error ? error.message : "No se pudo cargar la lista de espera"));
  }
}