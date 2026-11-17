import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

@Injectable({ providedIn: "root" })
export class AlertaService {
  private readonly db = supabase;

  async cargar(perfilId: string): Promise<number[]> {
    const { data, error } = await this.db
      .from("alertas")
      .select("pelicula_id")
      .eq("perfil_id", perfilId);

    if (error) throw error;

    return (data ?? []).map((a) => a.pelicula_id as number);
  }

  async alternar(perfilId: string, peliculaId: number, activa: boolean): Promise<void> {
    const { error } = activa
      ? await this.db
          .from("alertas")
          .delete()
          .eq("perfil_id", perfilId)
          .eq("pelicula_id", peliculaId)
      : await this.db
          .from("alertas")
          .insert({ perfil_id: perfilId, pelicula_id: peliculaId });

    if (error) throw error;
  }
}