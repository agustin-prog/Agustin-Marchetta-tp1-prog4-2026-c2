import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { ComboInput, ComboModel, ComboRow } from './candy.model';

@Injectable({ providedIn: 'root' })
export class ComboService {
  private readonly db = supabase;

  private items(comboId: number, c: ComboInput) {
    return c.items.map((i) => ({ combo_id: comboId, producto_id: i.productoId, cantidad: i.cantidad }));
  }

  private mapear(r: ComboRow): ComboModel {
    return {
      id: r.id,
      nombre: r.nombre,
      precio: Number(r.precio),
      imagenUrl: r.imagen_url ?? "",
      items: r.items_combos.map((i) => ({ productoId: i.producto_id, cantidad: i.cantidad })),
      activo: r.activo,
    };
  }

  async load(): Promise<ComboModel[]> {
    const { data, error } = await this.db
      .from("combos")
      .select("id, nombre, precio, imagen_url, activo, items_combos(producto_id, cantidad)")
      .order("nombre");

    if (error) throw error;

    return (data as unknown as ComboRow[]).map((r) => this.mapear(r));
  }

  async cambiarActivo(id: number, activo: boolean): Promise<void> {
    const { error } = await this.db
      .from("combos")
      .update({ activo })
      .eq("id", id);

    if (error) throw error;
  }

  async add(c: ComboInput): Promise<void> {
    const { data, error } = await this.db
      .from("combos")
      .insert({ nombre: c.nombre.trim(), precio: c.precio, imagen_url: c.imagenUrl || null })
      .select("id")
      .single();

    if (error) throw error;

    const { error: errorItems } = await this.db
      .from("items_combos")
      .insert(this.items(data.id, c));

    if (errorItems) {
      await this.db
        .from("combos")
        .delete()
        .eq("id", data.id);

      throw errorItems;
    }
  }

  async update(id: number, c: ComboInput): Promise<void> {
    const { error } = await this.db
      .from("combos")
      .update({ nombre: c.nombre.trim(), precio: c.precio, imagen_url: c.imagenUrl || null })
      .eq("id", id);

    if (error) throw error;

    const { error: errorBorrar } = await this.db
      .from("items_combos")
      .delete()
      .eq("combo_id", id);

    if (errorBorrar) throw errorBorrar;

    const { error: errorItems } = await this.db
      .from("items_combos")
      .insert(this.items(id, c));

    if (errorItems) throw errorItems;
  }

  async remove(id: number): Promise<void> {
    const { count, error: errorCount } = await this.db
      .from("venta_combos")
      .select("id", { count: "exact", head: true })
      .eq("combo_id", id);

    if (errorCount) throw errorCount;

    if ((count ?? 0) > 0) throw new Error("Este combo ya fue vendido y no se puede eliminar.");

    const { error: errorItems } = await this.db
      .from("items_combos")
      .delete()
      .eq("combo_id", id);

    if (errorItems) throw errorItems;

    const { error } = await this.db
      .from("combos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}