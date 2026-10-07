import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { PeliculaModel, PeliculaDraft, PeliculaPatch, RestriccionEdad } from "./pelicula.models";
import { GeneroModel } from "../generos/genero.model";

// tipo crudo que devuelve la DB (snake_case + géneros anidados)
interface PeliculaRow {
  id: number;
  nombre: string;
  sinopsis: string;
  poster_url: string | null;
  duracion_minutos: number;
  restriccion_edad: RestriccionEdad;
  preventa_habilitada: boolean;
  precio_preventa: number | null;
  pelicula_genero: { generos: GeneroModel }[];   // resultado del join
}

export interface PeliculaPayload {
  nombre: string;
  sinopsis: string;
  duracionMinutos: number;
  restriccionEdad: RestriccionEdad;
  preventaHabilitada: boolean;
  generoIds: number[];
}

@Injectable({ providedIn: "root" })
export class PeliculasStoreService {

  private readonly db = supabase;
  readonly peliculas = signal<PeliculaModel[]>([]);
  readonly loading = signal(true);

  private yaInicializado = false;

  init() {

    if(this.yaInicializado) return; // guard
    this.yaInicializado = true;

    this.load();
    this.db
      .channel("peliculas-changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "peliculas" },
        () => this.load()  
      )
      .subscribe();
  }

  async load(): Promise<void> {
    const { data, error } = await this.db
      .from("peliculas")
      .select("*, pelicula_genero(generos(id, nombre))")   // join con la tabla generos
      .order("id");

    if (error) throw error;

    this.peliculas.set((data ?? []).map((row: PeliculaRow) => this.mapear(row)));
    this.loading.set(false);
  }

  async add(payload: PeliculaPayload): Promise<void> {
    const { data, error } = await this.db
      .from("peliculas")
      .insert({
        nombre: payload.nombre,
        sinopsis: payload.sinopsis,
        duracion_minutos: payload.duracionMinutos,
        restriccion_edad: payload.restriccionEdad,
        preventa_habilitada: payload.preventaHabilitada,
      })
      .select()
      .single();

    if (error) throw error;

    const relaciones = payload.generoIds.map(generoId => ({

        pelicula_id: data.id,
        genero_id: generoId,
    }));

    const { error: errorGeneros } = await this.db
    .from("pelicula_genero")
    .insert(relaciones);

    if(errorGeneros) throw errorGeneros;

    await this.load();
  }

  async update( id:number, patch: Partial<PeliculaPayload>): Promise<void> {

    const {error} = await this.db
    .from("peliculas")
    .update({
        ...(patch.nombre !== undefined && { nombre: patch.nombre }),
        ...(patch.sinopsis !== undefined && { sinopsis: patch.sinopsis }),
        ...(patch.duracionMinutos !== undefined && { duracion_minutos: patch.duracionMinutos }),
        ...(patch.restriccionEdad !== undefined && { restriccion_edad: patch.restriccionEdad }),
        ...(patch.preventaHabilitada !== undefined && { preventa_habilitada: patch.preventaHabilitada }),
      })
    .eq("id", id);

    if(error) throw error;

    if(patch.generoIds) {
        await this.db.from("pelicula_genero").delete().eq("pelicula_id", id);
        await this.db.from("pelicula_genero")
        .insert(patch.generoIds.map(generoId => ({ pelicula_id: id, genero_id: generoId })));
    }

    await this.load();
  }

  async remove( id:number): Promise<void> {

    const {error} = await this.db
    .from("peliculas")
    .delete()
    .eq("id", id);

    if(error) throw error;

    await this.load();
  }

  find(id: number): PeliculaModel | undefined {
    return this.peliculas().find((p) => Number(p.id) === Number(id));
  }

  /* permite adaptar las filas en forma snake_case a camelCase */
  private mapear(row: PeliculaRow): PeliculaModel {
    return {
      id: row.id,
      nombre: row.nombre,
      sinopsis: row.sinopsis,
      imagenURL: row.poster_url ?? "https://placehold.co/300x450?text=Poster",
      duracionMinutos: row.duracion_minutos,
      generos: (row.pelicula_genero ?? []).map(pg => pg.generos),
      restriccionEdad: row.restriccion_edad,
    };
  }
}