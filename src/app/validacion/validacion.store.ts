import { Injectable, inject } from "@angular/core";
import { ValidacionService } from "./validacion.service";
import { VentaValidacion } from "./validacion.model";

@Injectable({ providedIn: "root" })
export class ValidacionStore {
  private readonly service = inject(ValidacionService);

  buscarCompra(qr: string): Promise<VentaValidacion | null> {
    return this.service.buscarCompra(qr);
  }

  validarEntradas(ventaId: number): Promise<void> {
    return this.service.validarEntradas(ventaId);
  }

  validarCandy(ventaId: number): Promise<void> {
    return this.service.validarCandy(ventaId);
  }
}