import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { CuponReglaInput, CuponReglaModel, CuponReglaRow } from "./cupon-regla.model";

@Injectable({ providedIn: "root" })
export class CuponReglaService {
  private readonly db = supabase;

  private mapear(r: CuponReglaRow): CuponReglaModel {
    return {
      id: r.id,
      nombre: r.nombre,
      descuentoPorcentaje: r.descuento_porcentaje,
      edadMinima: r.edad_minima,
      soloPrimeraCompra: r.solo_primera_compra,
      montoMinimo: r.monto_minimo === null ? null : Number(r.monto_minimo),
      vigenteDesde: r.vigente_desde ?? "",
      vigenteHasta: r.vigente_hasta ?? "",
      activo: r.activo,
    };
  }

  private aRow(i: CuponReglaInput) {
    return {
      nombre: i.nombre.trim(),
      descuento_porcentaje: i.descuentoPorcentaje,
      edad_minima: i.edadMinima,
      solo_primera_compra: i.soloPrimeraCompra,
      monto_minimo: i.montoMinimo,
      vigente_desde: i.vigenteDesde || null,
      vigente_hasta: i.vigenteHasta || null,
    };
  }

  async load(): Promise<CuponReglaModel[]> {
    const { data, error } = await this.db
      .from("cupon_reglas")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    return (data as CuponReglaRow[]).map((r) => this.mapear(r));
  }

  async add(i: CuponReglaInput): Promise<void> {
    const { error } = await this.db
      .from("cupon_reglas")
      .insert(this.aRow(i));

    if (error) throw error;
  }

  async update(id: number, i: CuponReglaInput): Promise<void> {
    const { error } = await this.db
      .from("cupon_reglas")
      .update(this.aRow(i))
      .eq("id", id);

    if (error) throw error;
  }

  async cambiarActivo(id: number, activo: boolean): Promise<void> {
    const { error } = await this.db
      .from("cupon_reglas")
      .update({ activo })
      .eq("id", id);

    if (error) throw error;
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.db
      .from("cupon_reglas")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}