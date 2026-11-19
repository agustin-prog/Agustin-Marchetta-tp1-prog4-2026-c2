import { Component, computed, inject, signal } from "@angular/core";
import { FiltroVentas, VentaAdminModel, VentaAdminStore } from "../../../ventas/venta-admin.store";
import { haceDias, hoy } from "../../../reportes/rangos";
import { formatoMoneda } from "../../../reportes/exportar-reporte";
import { mensajeDeError } from "../../../shared/errores";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";

@Component({
  imports: [FechaPipe],
  selector: 'app-ventas-list-admin',
  styleUrl: './ventas-list-admin.css',
  templateUrl: './ventas-list-admin.html',
})
export class VentasListAdmin {

  private readonly store = inject(VentaAdminStore);

  protected readonly desde = signal(haceDias(30));
  protected readonly hasta = signal(hoy());
  protected readonly estado = signal<FiltroVentas["estado"]>("todas");
  protected readonly ventas = signal<VentaAdminModel[] | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly totalCobrado = computed(() =>
    (this.ventas() ?? [])
      .filter((v) => v.estado !== "cancelada")
      .reduce((suma, v) => suma + v.total, 0),
  );

  protected readonly moneda = formatoMoneda;

  protected async buscar() {
    this.error.set(null);
    this.ventas.set(null);
    try {

      this.ventas.set(await this.store.listar({
        desde: this.desde(), hasta: this.hasta(), estado: this.estado(),
      }));

    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudieron cargar las ventas."));
      this.ventas.set([]);
    }
  }

  constructor() {
    this.buscar();
  }
}
