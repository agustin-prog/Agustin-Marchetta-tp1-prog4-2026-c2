import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { ButacaOcupacionModel, ButacaOcupacionPayload, EstadoButaca } from "./butacaOcupacion.model";

export interface ButacaOcupacionRow {
    id: number;
    funcion_id: number,
    butaca_id: number,
    estado: EstadoButaca,
}

@Injectable({ providedIn: "root" })
export class ButacaOcupacionStore {

    private readonly db = supabase;
    readonly butacas = signal<ButacaOcupacionModel[]>([]);
    readonly loading = signal(true);

    private yaInicializado = false;

    init() {

        if(this.yaInicializado) return; // guard
        this.yaInicializado = true;

        this.load();
        this.db
        .channel("ocupacion-changes")
        .on("postgres_changes",
            { event: "*", schema: "public", table: "ocupacion" },
            () => this.load()  
        )
        .subscribe();
    }

    async load(): Promise<void> {
        const { data, error } = await this.db
        .from("ocupacion")
        .select("*")  
        .order("id");

        if (error) throw error;
    
        this.butacas.set((data ?? []).map((row: ButacaOcupacionRow) => this.mapear(row)));
        this.loading.set(false);
    }

    async add(payload: ButacaOcupacionPayload): Promise<void> {

        const { data, error } = await this.db
        .from("ocupacion")
        .insert({
        funcion_id: payload.funcionId,
        butaca_id: payload.butacaId,
        estado: payload.estado,
        })
    
        if (error) throw error;
        await this.load();
    }

    estaOcupada(butacaId: number): boolean {
        return this.butacas().some(o => o.butacaId === butacaId && o.estado === 'confirmada');
    }   

    private mapear(row: ButacaOcupacionRow): ButacaOcupacionModel {
        return {
            id: row.id,
            funcionId: row.funcion_id,
            butacaId: row.butaca_id,
            estado: row.estado
        };
    }
}