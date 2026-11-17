import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { SalaModel, SalaRow } from "./sala.model";

@Injectable({ providedIn: "root" })
export class SalaService {
  private readonly db = supabase;

  private mapear(row: SalaRow): SalaModel {
    return { id: row.id, nombreSala: row.nombre, activa: row.activa };
  }

  async load(): Promise<SalaModel[]> {
    try {
      const { data, error } = await this.db
        .from("salas")
        .select("*")
        .order("id");

      if (error) throw error;

      return (data as SalaRow[]).map((row) => this.mapear(row));
    } catch (e) {
      throw e;
    }
  }

  async crear(nombre: string): Promise<void> {
    const { error } = await this.db.rpc("crear_sala", { p_nombre: nombre });

    if (error) throw error;
  }

  async renombrar(id: number, nombre: string): Promise<void> {
    const { error } = await this.db
      .from("salas")
      .update({ nombre: nombre.trim() })
      .eq("id", id);

    if (error) throw error;
  }

  async cambiarActiva(id: number, activa: boolean): Promise<void> {
    const { error } = await this.db
      .from("salas")
      .update({ activa })
      .eq("id", id);

    if (error) throw error;
  }

  // falla si la sala tiene funciones, en ese caso hay que desactivarla
  async eliminar(id: number): Promise<void> {
    const { error } = await this.db.rpc("eliminar_sala", { p_sala_id: id });

    if (error) throw error;
  }
}