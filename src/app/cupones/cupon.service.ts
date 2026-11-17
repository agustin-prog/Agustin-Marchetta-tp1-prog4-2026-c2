import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

export interface CuponBienvenida {
  id: number;
  porcentaje: number;
}

@Injectable({ providedIn: "root" })
export class CuponService {
  private readonly db = supabase;

  async bienvenidaDisponible(perfilId: string): Promise<CuponBienvenida | null> {
    const { data: cupon, error } = await this.db
      .from("cupones")
      .select("id, descuento_porcentaje")
      .eq("perfil_id", perfilId)
      .eq("es_bienvenida", true)
      .eq("usado", false)
      .maybeSingle();

    if (error) throw error;
    if (!cupon) return null;

    const { count, error: errorVentas } = await this.db
      .from("ventas")
      .select("id", { count: "exact", head: true })
      .eq("perfil_id", perfilId);

    if (errorVentas) throw errorVentas;

    return count === 0 ? { id: cupon.id, porcentaje: cupon.descuento_porcentaje } : null;
  }
}