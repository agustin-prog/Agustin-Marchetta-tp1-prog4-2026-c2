import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { hoyIso } from "../peliculas/pelicula-edad";
import { CuponDisponible } from "./cupon-regla.model";

@Injectable({ providedIn: "root" })
export class CuponReglaCuponesService {
  private readonly db = supabase;

  async misDisponibles(perfilId: string): Promise<CuponDisponible[]> {
    const { error: errorAsignar } = await this.db.rpc("asignar_cupones");
    if (errorAsignar) throw errorAsignar;

    const { data, error } = await this.db
      .from("cupones")
      .select("id, codigo, descuento_porcentaje, cupon_reglas(nombre, monto_minimo, vigente_desde, vigente_hasta, activo)")
      .eq("perfil_id", perfilId)
      .eq("usado", false)
      .eq("es_bienvenida", false);

    if (error) throw error;

    type Fila = {
      id: number;
      codigo: string;
      descuento_porcentaje: number;
      cupon_reglas: {
        nombre: string;
        monto_minimo: number | null;
        vigente_desde: string | null;
        vigente_hasta: string | null;
        activo: boolean;
      } | null;
    };

    const hoy = hoyIso();
    return (data as unknown as Fila[])
      .filter((f) => {
        const r = f.cupon_reglas;
        if (!r) return true;
        return (
          r.activo &&
          (!r.vigente_desde || hoy >= r.vigente_desde) &&
          (!r.vigente_hasta || hoy <= r.vigente_hasta)
        );
      })
      .map((f) => ({
        id: f.id,
        codigo: f.codigo,
        porcentaje: f.descuento_porcentaje,
        nombre: f.cupon_reglas?.nombre ?? f.codigo,
        montoMinimo: f.cupon_reglas?.monto_minimo ?? null,
      }));
  }
}