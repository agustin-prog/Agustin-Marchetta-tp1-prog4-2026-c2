import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { FuncionInput, FuncionModel, FuncionRowWrite, FuncionRow } from "./funcion.model";

@Injectable({ providedIn: "root" })
export class FuncionService {
    private readonly db = supabase;

    private aRow(f: FuncionInput): FuncionRowWrite {
        return {
            pelicula_id: f.peliculaId,
            sala_id: f.salaId,
            fecha_hora_inicio: f.fechaHoraInicio,
            formato: f.formato,
            idioma: f.idioma,
            precio: f.precio,
        };
    }

    private mapear(row: FuncionRow): FuncionModel {
        return {
            id: row.id,
            peliculaId: row.pelicula_id,
            salaId: row.sala_id,
            fechaHoraInicio: row.fecha_hora_inicio,
            formato: row.formato,
            idioma: row.idioma,
            precio: row.precio,
            cancelada: row.cancelada,
        };
    }

    async load(): Promise<FuncionModel[]> {
        const { data, error } = await this.db
            .from("funciones")
            .select("*")
            .order("fecha_hora_inicio");

        if (error) throw error;

        return (data ?? []).map((row: FuncionRow) => this.mapear(row));
    }

    async add(input: FuncionInput): Promise<void> {
        const { error } = await this.db
            .from("funciones")
            .insert(this.aRow(input))
            .select()
            .single();

        if (error) throw error;
    }

    async addMany(inputs: FuncionInput[]): Promise<void> {
        const { error } = await this.db
            .from("funciones")
            .insert(inputs.map((i) => this.aRow(i)));

        if (error) throw error;
    }

    async update(id: number, input: FuncionInput): Promise<void> {
        const { error } = await this.db
            .from("funciones")
            .update(this.aRow(input))
            .eq("id", id);

        if (error) throw error;
    }

    async remove(id: number): Promise<void> {
        const { error } = await this.db
            .from("funciones")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
}