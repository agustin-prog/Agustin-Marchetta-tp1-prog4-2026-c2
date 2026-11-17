import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { ButacaOcupacionStore } from "../butacas/butacaOcupacion.store";

export interface OpcionesCompra {
  productos?: { producto_id: number; cantidad: number }[];
  combos?: { combo_id: number; cantidad: number }[];
  cuponId?: number;
  usarCredito?: boolean;
  fechaNacimiento?: string;
  usarEntradaGratis?: boolean;
}

@Injectable({ providedIn: "root" })
export class CompraService {
  private readonly db = supabase;

  constructor(private readonly storeOcupacion: ButacaOcupacionStore) {}

  async confirmarCompra(
    funcionId: number,
    butacaIds: number[],
    opciones: OpcionesCompra = {},
  ): Promise<string> {
    const { data, error } = await this.db.rpc("confirmar_compra", {
      p_funcion_id: funcionId,
      p_butaca_ids: butacaIds,
      p_token: this.storeOcupacion.token,
      p_productos: opciones.productos ?? [],
      p_combos: opciones.combos ?? [],
      p_cupon_id: opciones.cuponId ?? null,
      p_usar_credito: opciones.usarCredito ?? false,
      p_usar_entrada_gratis: opciones.usarEntradaGratis ?? false,
      p_fecha_nacimiento: opciones.fechaNacimiento ?? null,
    });

    if (error) throw error;

    await this.storeOcupacion.load();
    return data as string;
  }
}