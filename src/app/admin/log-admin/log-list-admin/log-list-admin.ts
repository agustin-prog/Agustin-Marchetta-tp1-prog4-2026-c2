import { DatePipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { haceDias, hoy } from "../../../reportes/rangos";
import { mensajeDeError } from "../../../shared/errores";
import { LogAdminStore, LogModel } from "../../../log/log-admin.store";

@Component({
  imports: [DatePipe],
  selector: 'app-log-list-admin',
  styleUrl: './log-list-admin.css',
  templateUrl: './log-list-admin.html',
})
export class LogListAdmin {

  private readonly store = inject(LogAdminStore);

  protected readonly desde = signal(haceDias(7));
  protected readonly hasta = signal(hoy());
  protected readonly texto = signal("");
  protected readonly registros = signal<LogModel[] | null>(null);
  protected readonly error = signal<string | null>(null);

  protected async buscar() {
    this.error.set(null);
    this.registros.set(null);

    try {
      this.registros.set(await this.store.listar({
        desde: this.desde(), hasta: this.hasta(), texto: this.texto(),
      }));

    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudo cargar el log."));
      this.registros.set([]);
    }
  }

  constructor() {
    this.buscar();
  }
}
