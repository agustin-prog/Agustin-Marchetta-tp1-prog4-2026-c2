import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { PeliculaInput, PeliculaModel, RestriccionEdad } from './pelicula.model';
import { GeneroModel } from '../generos/genero.model';

export interface PeliculaRow {
  id: number;
  nombre: string;
  sinopsis: string;
  poster_url: string | null;
  duracion_minutos: number;
  restriccion_edad: RestriccionEdad;
  fecha_estreno: string | null;
  preventa_habilitada: boolean;
  precio_preventa: number | null;
  pelicula_genero: { generos: GeneroModel }[];
}

type PeliculaRowWrite = Omit<PeliculaRow, 'id' | 'pelicula_genero'>;

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  private readonly db = supabase;

  private aRow(p: PeliculaInput): PeliculaRowWrite {
    return {
      nombre: p.nombre,
      sinopsis: p.sinopsis,
      duracion_minutos: p.duracionMinutos,
      restriccion_edad: p.restriccionEdad,
      preventa_habilitada: p.preventaHabilitada,
      poster_url: p.posterUrl || null,
      fecha_estreno: p.fechaEstreno || null,
      precio_preventa: p.preventaHabilitada ? p.precioPreventa : null,
    };
  }

  private mapear(row: PeliculaRow): PeliculaModel {
    return {
      id: row.id,
      nombre: row.nombre,
      sinopsis: row.sinopsis,
      duracionMinutos: row.duracion_minutos,
      generos: (row.pelicula_genero ?? []).map((pg) => pg.generos),
      restriccionEdad: row.restriccion_edad,
      posterUrl: row.poster_url ?? '',
      fechaEstreno: row.fecha_estreno?.slice(0, 10) ?? '',
      preventaHabilitada: row.preventa_habilitada,
      precioPreventa: row.precio_preventa,
    };
  }

  async load(): Promise<PeliculaModel[]> {
    const { data, error } = await this.db
      .from('peliculas')
      .select('*, pelicula_genero(generos(id, nombre))')
      .order('id');

    if (error) throw error;

    return (data ?? []).map((row: PeliculaRow) => this.mapear(row));
  }

  async add(input: PeliculaInput): Promise<void> {
    const { data, error } = await this.db
      .from('peliculas')
      .insert(this.aRow(input))
      .select()
      .single();

    if (error) throw error;

    const relaciones = input.generoIds.map((generoId) => ({
      pelicula_id: data.id,
      genero_id: generoId,
    }));

    const { error: errorGeneros } = await this.db.from('pelicula_genero').insert(relaciones);
    if (errorGeneros) throw errorGeneros;
  }

  async update(id: number, input: PeliculaInput): Promise<void> {
    const { error } = await this.db
      .from('peliculas')
      .update(this.aRow(input))
      .eq('id', id);

    if (error) throw error;

    if (input.generoIds) {
      await this.db.from('pelicula_genero').delete().eq('pelicula_id', id);
      await this.db.from('pelicula_genero').insert(
        input.generoIds.map((generoId) => ({ pelicula_id: id, genero_id: generoId })),
      );
    }
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.db
      .from('peliculas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}