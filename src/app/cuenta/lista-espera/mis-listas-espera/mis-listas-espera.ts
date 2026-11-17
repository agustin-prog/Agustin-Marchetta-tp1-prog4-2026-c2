import { Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ListaEsperaStore } from "../../../lista-espera/lista-espera.store";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";

@Component({
  imports: [RouterLink, FechaPipe],
  selector: "app-mis-listas-espera",
  styleUrl: "./mis-listas-espera.css",
  templateUrl: "./mis-listas-espera.html",
})
export class MisListasEspera {

  private readonly store = inject(ListaEsperaStore);
  protected readonly listas = this.store.mias;

  protected readonly error = signal<string | null>(null);

  async salir(funcionId: number) {
    this.error.set(null);
    try {
      await this.store.salir(funcionId);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : "No se pudo salir de la lista");
    }
  }
}