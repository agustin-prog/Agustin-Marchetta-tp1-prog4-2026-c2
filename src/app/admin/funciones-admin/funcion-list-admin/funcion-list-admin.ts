import { Component, computed, inject, input, numberAttribute, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FuncionCardAdmin } from "../funcion-card-admin/funcion-card-admin";
import { FuncionStore } from "../../../funciones/funcion.store";
import { PeliculaStore } from "../../../peliculas/pelicula.store";
import { CompraAnonima, FuncionModel } from "../../../funciones/funcion.model";
import { formatoMoneda } from "../../../reportes/exportar-reporte";
import { textoError } from "../../../shared/errores";
import { PrecioArsPipe } from "../../../pipes/pipe-precio-ars/precio-ars-pipe";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";

@Component({
  imports: [FuncionCardAdmin, RouterLink, FechaPipe, PrecioArsPipe],
  selector: 'app-funcion-list-admin',
  styleUrl: './funcion-list-admin.css',
  templateUrl: './funcion-list-admin.html',
})
export class FuncionListAdmin {

  peliculaId = input.required({ transform: numberAttribute });

  private readonly funcionStore = inject(FuncionStore);
  private readonly peliculaStore = inject(PeliculaStore);

  protected readonly error = signal<string | null>(null);
  protected readonly resultado = signal<{ registradas: number; anonimas: number; total: number } | null>(null);
  protected readonly panelAnonimas = signal<{ titulo: string; compras: CompraAnonima[] } | null>(null);

  protected readonly loading = this.funcionStore.loading;
  protected readonly pelicula = computed(() => this.peliculaStore.find(this.peliculaId()));
  protected readonly funciones = computed(() => this.funcionStore.buscarPorPeliculaAdmin(this.peliculaId()));

  protected async cancelarFuncion(f: FuncionModel) {
    this.error.set(null);
    this.resultado.set(null);
    this.panelAnonimas.set(null);

    try {
      const r = await this.funcionStore.resumenCancelacion(f.id);

      const aviso =
        `Vas a cancelar la función del ${this.cuando(f)}.\n\n` +
        `• ${r.comprasRegistradas} compra(s) de usuarios registrados: se acreditarán ${formatoMoneda(r.totalAAcreditar)} en total.\n` +
        `• ${r.comprasAnonimas} compra(s) anónimas: no reciben crédito y deberán atenderse en persona.\n\n` +
        `Esta acción no se puede deshacer. ¿Continuar?`;
      if (!confirm(aviso)) return;

      const res = await this.funcionStore.cancelar(f.id);
      this.resultado.set({ registradas: res.comprasRegistradas, anonimas: res.comprasAnonimas, total: res.totalAcreditado });

      if (res.comprasAnonimas > 0) await this.verAnonimas(f);
    } catch (error) {
      this.error.set(textoError(error, "No se pudo cancelar la función."));
    }
  }

  protected async verAnonimas(f: FuncionModel) {
    this.error.set(null);
    try {
      this.panelAnonimas.set({
        titulo: this.cuando(f),
        compras: await this.funcionStore.comprasAnonimas(f.id),
      });
    } catch (error) {
      this.error.set(textoError(error, "No se pudieron cargar las compras anónimas."));
    }
  }

  private cuando(f: FuncionModel): string {
    return new Date(f.fechaHoraInicio).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
  }

  constructor() {
    this.funcionStore.init();
    this.peliculaStore.init();
  }
}
