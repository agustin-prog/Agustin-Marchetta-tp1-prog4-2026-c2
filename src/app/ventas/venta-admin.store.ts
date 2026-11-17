import { Injectable, inject } from '@angular/core';
import { VentaAdminService } from './venta-admin.service';
import { FiltroVentas, VentaAdminModel } from './venta-admin.model';

export type { FiltroVentas, VentaAdminModel };

@Injectable({ providedIn: 'root' })
export class VentaAdminStore {
  private readonly service = inject(VentaAdminService);

  async listar(f: FiltroVentas): Promise<VentaAdminModel[]> {
    return this.service.listar(f);
  }
}