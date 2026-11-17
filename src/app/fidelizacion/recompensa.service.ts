import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { RecompensaInput, RecompensaModel, RecompensaRow } from "./recompensa.model";

@Injectable({ providedIn: "root" })
export class RecompensaService {
  private readonly db = supabase;

  listar(): Promise<RecompensaModel[]> {
    return this.consultar(true);
  }

  listarTodas(): Promise<RecompensaModel[]> {
    return this.consultar(false);
  }

  private async consultar(soloActivas: boolean): Promise<RecompensaModel[]> {
    let consulta = this.db
      .from("recompensas")
      .select("id, nombre, costo_puntos, producto_id, activa, productos(nombre)")
      .order("costo_puntos");

    if (soloActivas) consulta = consulta.eq("activa", true);

    const { data, error } = await consulta;
    if (error) throw error;

    return (data as unknown as RecompensaRow[]).map((r) => ({
      id: r.id,
      nombre: r.nombre,
      costoPuntos: r.costo_puntos,
      productoId: r.producto_id,
      productoNombre: r.productos?.nombre ?? "",
      activa: r.activa,
    }));
  }

  async crear(i: RecompensaInput): Promise<void> {
    const { error } = await this.db
      .from("recompensas")
      .insert(this.aRow(i));

    if (error) throw error;
  }

  async actualizar(id: number, i: RecompensaInput): Promise<void> {
    const { error } = await this.db
      .from("recompensas")
      .update(this.aRow(i))
      .eq("id", id);

    if (error) throw error;
  }

  async eliminar(id: number): Promise<void> {
    const { error } = await this.db
      .from("recompensas")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async cambiarActiva(id: number, activa: boolean): Promise<void> {
    const { error } = await this.db
      .from("recompensas")
      .update({ activa })
      .eq("id", id);

    if (error) throw error;
  }

  private aRow(i: RecompensaInput) {
    return { nombre: i.nombre.trim(), costo_puntos: i.costoPuntos, producto_id: i.productoId };
  }
}