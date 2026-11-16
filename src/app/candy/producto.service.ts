import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { ProductoInput, ProductoModel, ProductoRow } from './candy.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly db = supabase;

  private mapear(r: ProductoRow): ProductoModel {
    return {
      id: r.id,
      categoriaId: r.categoria_id,
      nombre: r.nombre,
      imagenUrl: r.imagen_url ?? "",
      precio: Number(r.precio),
      activo: r.activo,
    };
  }

  private aRow(p: ProductoInput) {
    return {
      categoria_id: p.categoriaId,
      nombre: p.nombre.trim(),
      imagen_url: p.imagenUrl || null,
      precio: p.precio,
    };
  }

  async load(): Promise<ProductoModel[]> {
    const { data, error } = await this.db
      .from("productos")
      .select("*")
      .order("nombre");

    if (error) throw error;
    return (data as ProductoRow[]).map((r) => this.mapear(r));
  }

  async cambiarActivo(id: number, activo: boolean): Promise<void> {
    const { error } = await this.db
      .from("productos")
      .update({ activo })
      .eq("id", id);

    if (error) throw error;
  }

  async add(p: ProductoInput): Promise<void> {
    const { error } = await this.db
      .from("productos")
      .insert(this.aRow(p));

    if (error) throw error;
  }

  async update(id: number, p: ProductoInput): Promise<void> {
    const { error } = await this.db
      .from("productos")
      .update(this.aRow(p))
      .eq("id", id);

    if (error) throw error;
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.db
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}