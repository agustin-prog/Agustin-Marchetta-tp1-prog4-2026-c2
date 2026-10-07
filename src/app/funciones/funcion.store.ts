import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { FuncionModel, FuncionPayload } from "./funcion.model";

// tipo crudo que devuelve la DB
interface FuncionRow {
    id: number;
    pelicula_id: number;
    sala_id: number;
    fecha_hora_inicio: string;
    formato: FuncionModel["formato"];
    idioma: FuncionModel["idioma"];
    precio: number;
}

@Injectable({ providedIn: "root" })
export class FuncionStore {

    private readonly db = supabase;
    readonly funciones = signal<FuncionModel[]>([]);
    readonly loading = signal(true);

    private yaInicializado = false;

    init() {

        if(this.yaInicializado) return; // guard
        this.yaInicializado = true;

        this.load();
        this.db
        .channel("funciones-changes")
        .on("postgres_changes",
            { event: "*", schema: "public", table: "funciones" },
            () => this.load()  
        )
        .subscribe();
    }

    async load(): Promise<void> {
        const { data, error } = await this.db
        .from("funciones")
        .select("*")
        .order("fecha_hora_inicio");

        if (error) throw error;

        this.funciones.set((data ?? []).map((row: FuncionRow) => this.mapear(row)));
        this.loading.set(false);
    }

    buscarPorPelicula(peliculaId: number): FuncionModel[] {
        return this.funciones().filter(f => f.peliculaId === peliculaId);
    }

    find(id: number): FuncionModel | undefined {
        return this.funciones().find(f => Number(f.id) === Number(id));
    }

    async add(payload: FuncionPayload): Promise<void> {
        const { data, error } = await this.db
          .from("funciones")
          .insert({
            pelicula_id: payload.peliculaId,
            sala_id: payload.salaId,
            fecha_hora_inicio: payload.fechaHoraInicio.toISOString(),
            formato: payload.formato,
            idioma: payload.idioma,
            precio: payload.precio,
          })
          .select()
          .single();
    
        if (error) throw error;
        await this.load();
    }

    async remove(id: number): Promise<void> {
        const { error } = await this.db
        .from("funciones")
        .delete()
        .eq("id", id);

        if (error) throw error;
        await this.load();
    }

    private mapear(row: FuncionRow): FuncionModel {
        return {
            id: row.id,
            peliculaId: row.pelicula_id,
            salaId: row.sala_id,
            fechaHoraInicio: new Date(row.fecha_hora_inicio),
            formato: row.formato,
            idioma: row.idioma,
            precio: row.precio,
        };
    }
}