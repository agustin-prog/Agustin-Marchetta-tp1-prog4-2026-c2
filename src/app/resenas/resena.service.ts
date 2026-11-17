import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { ResenaConPelicula, ResenaModel, ResenaRow } from './resena.model';

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private readonly db = supabase;

  private mapear(r: ResenaRow): ResenaModel {
    return {
      id: r.id,
      perfilId: r.perfil_id,
      peliculaId: r.pelicula_id,
      estrellas: r.estrellas,
      comentario: r.comentario ?? "",
      fecha: r.created_at,
    };
  }

  async porPelicula(peliculaId: number): Promise<ResenaModel[]> {
    const { data, error } = await this.db
      .from("resenas")
      .select("*")
      .eq("pelicula_id", peliculaId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ResenaRow[]).map((r) => this.mapear(r));
  }

  async guardar(peliculaId: number, perfilId: string, estrellas: number, comentario: string): Promise<void> {
    const campos = { estrellas, comentario: comentario.trim() || null };

    const { data: previa, error: errorBuscar } = await this.db
      .from("resenas")
      .select("id")
      .eq("perfil_id", perfilId)
      .eq("pelicula_id", peliculaId)
      .maybeSingle();

    if (errorBuscar) throw errorBuscar;

    const { error } = previa
      ? await this.db.from("resenas").update(campos).eq("id", previa.id)
      : await this.db.from("resenas").insert({ ...campos, perfil_id: perfilId, pelicula_id: peliculaId });
    if (error) throw error;
  }

  async porPerfil(perfilId: string): Promise<ResenaConPelicula[]> {
    const { data, error } = await this.db
      .from("resenas")
      .select("id, pelicula_id, estrellas, comentario, created_at, peliculas(nombre)")
      .eq("perfil_id", perfilId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    type Fila = {
      id: number;
      pelicula_id: number;
      estrellas: number;
      comentario: string | null;
      created_at: string;
      peliculas: { nombre: string } | null;
    };
    return (data as unknown as Fila[]).map((r) => ({
      id: r.id,
      peliculaId: r.pelicula_id,
      pelicula: r.peliculas?.nombre ?? "",
      estrellas: r.estrellas,
      comentario: r.comentario ?? "",
      fecha: r.created_at,
    }));
  }
}