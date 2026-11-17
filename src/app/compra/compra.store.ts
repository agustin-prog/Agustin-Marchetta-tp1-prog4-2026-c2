import { Injectable, inject } from "@angular/core";
import { CompraService, OpcionesCompra } from "./compra.service";

@Injectable({ providedIn: "root" })
export class CompraStore {
  private readonly service = inject(CompraService);

  confirmarCompra(
    funcionId: number,
    butacaIds: number[],
    opciones: OpcionesCompra = {},
  ): Promise<string> {
    return this.service.confirmarCompra(funcionId, butacaIds, opciones);
  }
}