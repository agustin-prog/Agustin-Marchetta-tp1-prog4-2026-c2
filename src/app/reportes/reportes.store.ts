import { Injectable, inject } from "@angular/core";
import { ReporteService } from "./reporte.service";
import { TablaReporte } from "./exportar-reporte";

@Injectable({ providedIn: "root" })
export class ReporteStore {
  private readonly service = inject(ReporteService);

  topPeliculas(cantidad: number): Promise<{ peliculaId: number; cantidad: number }[]> {
    return this.service.topPeliculas(cantidad);
  }

  facturacion(desde: string, hasta: string): Promise<TablaReporte> {
    return this.service.facturacion(desde, hasta);
  }

  entradas(desde: string, hasta: string): Promise<TablaReporte> {
    return this.service.entradas(desde, hasta);
  }

  peliculasVistas(desde: string, hasta: string, titulo: string): Promise<TablaReporte> {
    return this.service.peliculasVistas(desde, hasta, titulo);
  }

  candy(desde: string, hasta: string): Promise<TablaReporte> {
    return this.service.candy(desde, hasta);
  }
}