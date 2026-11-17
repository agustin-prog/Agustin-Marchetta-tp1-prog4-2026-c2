import { Injectable, inject } from "@angular/core";
import { CuponService, CuponBienvenida } from "./cupon.service";

export type { CuponBienvenida };

@Injectable({ providedIn: "root" })
export class CuponStore {
  private readonly service = inject(CuponService);

  bienvenidaDisponible(perfilId: string): Promise<CuponBienvenida | null> {
    return this.service.bienvenidaDisponible(perfilId);
  }
}