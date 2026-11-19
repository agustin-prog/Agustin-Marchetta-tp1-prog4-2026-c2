import { Component, computed, inject, input, output } from "@angular/core";
import { FuncionModel } from "../../../funciones/funcion.model";
import { SalaStore } from "../../../salas/sala.store";
import { FuncionStore } from "../../../funciones/funcion.store";
import { PrecioArsPipe } from "../../../pipes/pipe-precio-ars/precio-ars-pipe";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";
import { DatePipe } from "@angular/common";
import { textoError } from "../../../shared/errores";

@Component({
  imports: [PrecioArsPipe, DatePipe, FechaPipe],
  selector: 'app-funcion-card-admin',
  styleUrl: './funcion-card-admin.css',
  templateUrl: './funcion-card-admin.html',
})
export class FuncionCardAdmin {

  funcion = input.required<FuncionModel>();

  onBorrarError = output<string | null>();
  cancelar = output<FuncionModel>();
  verAnonimas = output<FuncionModel>();

  private readonly funcionStore = inject(FuncionStore);
  private readonly salaStore = inject(SalaStore);

  protected readonly sala = computed(() => this.salaStore.find(this.funcion().salaId));

  protected readonly puedeCancelar = computed(() =>
    !this.funcion().cancelada && new Date(this.funcion().fechaHoraInicio).getTime() > Date.now(),
  );

  protected async borrarFuncion(id: number) {
    const fechaFuncion = new Date(this.funcion().fechaHoraInicio).toLocaleString();
    if (!confirm(`¿Eliminar la función "${fechaFuncion}"?`)) return;
    this.onBorrarError.emit(null);

    try {
      await this.funcionStore.remove(id);
    } catch (error) {
      this.onBorrarError.emit(textoError(error, "No se pudo eliminar la función."));
    }
  }

  constructor() {
    this.salaStore.init();
  }
}
