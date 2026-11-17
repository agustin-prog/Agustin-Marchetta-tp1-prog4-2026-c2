import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { NotificacionModel, NotificacionRow } from "./notificacion.model";

@Injectable({ providedIn: "root" })
export class NotificacionService {
  private readonly db = supabase;

  async cargar(): Promise<NotificacionModel[]> {
    const { data, error } = await this.db
      .from("notificaciones")
      .select("id, tipo, titulo, mensaje, enlace, leida, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(30);

    if (error) throw error;
    return (data ?? []).map((r: NotificacionRow) => this.mapear(r));
  }

  async marcarLeida(id: number): Promise<void> {
    const { error } = await this.db
      .from("notificaciones")
      .update({ leida: true })
      .eq("id", id);

    if (error) throw error;
  }

  async marcarTodasLeidas(): Promise<void> {
    const { error } = await this.db
      .from("notificaciones")
      .update({ leida: true })
      .eq("leida", false);

    if (error) throw error;
  }

  private mapear(r: NotificacionRow): NotificacionModel {
    return {
      id: r.id,
      tipo: r.tipo,
      titulo: r.titulo,
      mensaje: r.mensaje,
      enlace: r.enlace,
      leida: r.leida,
      createdAt: r.created_at,
    };
  }
}