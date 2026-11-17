import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

const CLAVE_BIENVENIDA = "cupon_bienvenida_porcentaje";

@Injectable({ providedIn: "root" })
export class ConfiguracionService {
  private readonly db = supabase;

  async cargar(): Promise<number> {
    const { data, error } = await this.db
      .from("configuracion")
      .select("valor")
      .eq("clave", CLAVE_BIENVENIDA)
      .maybeSingle();

    if (error) throw error;

    return Number(data?.valor) || 10;
  }

  async guardarCuponBienvenida(porcentaje: number): Promise<void> {
    const { data, error } = await this.db
      .from("configuracion")
      .update({ valor: String(porcentaje) })
      .eq("clave", CLAVE_BIENVENIDA)
      .select("clave");

    if (error) throw error;

    if (!data?.length) throw new Error("No se pudo guardar el porcentaje.");
  }
}