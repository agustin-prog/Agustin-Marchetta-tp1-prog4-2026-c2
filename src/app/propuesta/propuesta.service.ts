import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

export type EstadoPropuesta = "pendiente" | "aceptada" | "rechazada";

interface PropuestaRow {
  id: number;
  titulo: string;
  descripcion: string;
  motivo: string;
  estado: EstadoPropuesta;
  created_at: string;
  perfiles: { nombre: string | null; apellido: string | null } | null;
}

export interface PropuestaModel {
  id: number;
  titulo: string;
  descripcion: string;
  motivo: string;
  estado: EstadoPropuesta;
  fecha: string;
  cliente: string;
}

const COLUMNAS =
  "id, titulo, descripcion, motivo, estado, created_at, perfiles!perfil_id(nombre, apellido)";

@Injectable({ providedIn: "root" })
export class PropuestaService {
  private readonly db = supabase;

  private mapear(r: PropuestaRow): PropuestaModel {
    const nombre = `${r.perfiles?.nombre ?? ""} ${r.perfiles?.apellido ?? ""}`.trim();
    return {
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion,
      motivo: r.motivo,
      estado: r.estado,
      fecha: r.created_at,
      cliente: nombre || "Cliente",
    };
  }

  async cargarMias(userId: string): Promise<PropuestaModel[]> {
    const { data, error } = await this.db
      .from("propuestas")
      .select(COLUMNAS)
      .eq("perfil_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data as unknown as PropuestaRow[]).map((r) => this.mapear(r));
  }

  async enviar(titulo: string, descripcion: string, motivo: string): Promise<void> {
    const { error } = await this.db.rpc("enviar_propuesta", {
      p_titulo: titulo,
      p_descripcion: descripcion,
      p_motivo: motivo,
    });

    if (error) throw error;
  }

  async listar(estado: EstadoPropuesta | "todas"): Promise<PropuestaModel[]> {
    let consulta = this.db
      .from("propuestas")
      .select(COLUMNAS)
      .order("created_at", { ascending: false })
      .limit(200);

    if (estado !== "todas") consulta = consulta.eq("estado", estado);

    const { data, error } = await consulta;
    if (error) throw error;

    return (data as unknown as PropuestaRow[]).map((r) => this.mapear(r));
  }

  async resolver(id: number, aceptar: boolean): Promise<void> {
    const { error } = await this.db.rpc("resolver_propuesta", { p_id: id, p_aceptar: aceptar });
    if (error) throw error;
  }
}