import { Injectable, inject } from "@angular/core";
import { RecompensaService } from "./recompensa.service";
import { RecompensaCanjeService } from "./recompensa-canje.service";
import { CanjeModel, RecompensaInput, RecompensaModel } from "./recompensa.model";

@Injectable({ providedIn: "root" })
export class RecompensaStore {
  private readonly service = inject(RecompensaService);
  private readonly canjeService = inject(RecompensaCanjeService);

  listar(): Promise<RecompensaModel[]> {
    return this.service.listar();
  }

  listarTodas(): Promise<RecompensaModel[]> {
    return this.service.listarTodas();
  }

  crear(i: RecompensaInput): Promise<void> {
    return this.service.crear(i);
  }

  actualizar(id: number, i: RecompensaInput): Promise<void> {
    return this.service.actualizar(id, i);
  }

  eliminar(id: number): Promise<void> {
    return this.service.eliminar(id);
  }

  cambiarActiva(id: number, activa: boolean): Promise<void> {
    return this.service.cambiarActiva(id, activa);
  }

  // devuelve el código QR si la recompensa es un producto, o null si es una entrada
  canjear(recompensaId: number): Promise<string | null> {
    return this.canjeService.canjear(recompensaId);
  }

  entradasGratisPendientes(perfilId: string): Promise<number> {
    return this.canjeService.entradasGratisPendientes(perfilId);
  }

  misCanjes(perfilId: string): Promise<CanjeModel[]> {
    return this.canjeService.misCanjes(perfilId);
  }
}