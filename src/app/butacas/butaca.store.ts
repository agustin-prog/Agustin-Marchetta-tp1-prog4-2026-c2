import { Injectable, numberAttribute, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { ButacaModel, ButacaPayload } from "./butaca.model";
import { construirMatriz, generarButacas } from "./butaca-generador";

export interface ButacaRow {
  id: number;
  sala_id: number,
  letra_fila: string,
  numero: number,
  sector: number,
  tipo: ButacaModel["tipo"],
}

@Injectable({ providedIn: "root" })
export class ButacaStore {

    private readonly db = supabase;
    readonly butacas = signal<ButacaModel[]>([]);
    readonly loading = signal(true);

    private yaInicializado = false;

    init() {

        if(this.yaInicializado) return; // guard
        this.yaInicializado = true;

        this.load();
        this.db
        .channel("butacas-changes")
        .on("postgres_changes",
            { event: "*", schema: "public", table: "butacas" },
            () => this.load()  
        )
        .subscribe();
    }

    async load(): Promise<void> {
        const { data, error } = await this.db
        .from("butacas")
        .select("*")   
        .order("id");

        if (error) throw error;
    
        this.butacas.set((data ?? []).map((row: ButacaRow) => this.mapear(row)));
        this.loading.set(false);
    }

    async add(salaId: number): Promise<void> {

        if(this.butacas().some(b => b.salaId === salaId)) return;

        const filas = generarButacas(salaId).map(p => ({
            sala_id: p.salaId,
            letra_fila: p.letraFila,
            numero: p.numero,
            sector: p.sector,
            tipo: p.tipo,
        }));

        const { error } = await this.db
        .from("butacas")
        .insert(filas);
    
        if (error) throw error;
        await this.load();
    }

    matrizPorSala(salaId: number): ButacaModel[][][] {
        return construirMatriz(this.butacas().filter(b => b.salaId === salaId));
    }

    private mapear(row: ButacaRow): ButacaModel {
        return {
            id: row.id,
            salaId: row.sala_id,
            letraFila: row.letra_fila,
            numero: row.numero,
            sector: row.sector,
            tipo: row.tipo,
        };
    }
}