import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

export interface FiltroLog {
  desde: string;
  hasta: string;
  texto: string;
}

interface LogRow {
  id: number;
  accion: string;
  detalle: string | null;
  created_at: string;
  perfil_id: string | null;
  perfiles: { 
    nombre: string | null; 
    apellido: string | null; 
    rol: string } | null;
}

export interface LogModel {
  id: number;
  fecha: string;
  usuario: string;
  rol: string;
  accion: string;
  detalle: string;
}

@Injectable({ providedIn: "root" })
export class LogAdminService {
  private readonly db = supabase;

  async listar(f: FiltroLog): Promise<LogModel[]> {
    let consulta = this.db
      .from("log")
      .select("id, accion, detalle, created_at, perfil_id, perfiles(nombre, apellido, rol)")
      .order("created_at", { ascending: false })
      .limit(300);

    if (f.desde) consulta = consulta.gte("created_at", `${f.desde}T00:00:00-03:00`);
    if (f.hasta) consulta = consulta.lte("created_at", `${f.hasta}T23:59:59.999-03:00`);

    const texto = f.texto.replace(/[,()%*]/g, " ").trim();
    if (texto) consulta = consulta.or(`accion.ilike.%${texto}%,detalle.ilike.%${texto}%`);

    const { data, error } = await consulta;
    if (error) throw error;

    return (data as unknown as LogRow[]).map((r) => {
      const nombre = `${r.perfiles?.nombre ?? ""} ${r.perfiles?.apellido ?? ""}`.trim();
      return {
        id: r.id,
        fecha: r.created_at,
        usuario: nombre || (r.perfil_id ? "Usuario" : "Sistema"),
        rol: r.perfiles?.rol ?? "",
        accion: r.accion,
        detalle: r.detalle ?? "",
      };
    });
  }
}