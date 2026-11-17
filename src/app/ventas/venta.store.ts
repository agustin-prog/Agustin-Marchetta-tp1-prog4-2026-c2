import { Injectable, inject } from '@angular/core';
import { VentaService } from './venta.service';
import { PeliculaVista, VentaModel } from './venta.model';

@Injectable({ providedIn: 'root' })
export class VentaStore {
  private readonly service = inject(VentaService);

  listarMias(perfilId: string): Promise<VentaModel[]> {
    return this.service.listarMias(perfilId);
  }

  cancelar(qr: string): Promise<number> {
    return this.service.cancelar(qr);
  }

  peliculasVistas(perfilId: string): Promise<PeliculaVista[]> {
    return this.service.peliculasVistas(perfilId);
  }
}