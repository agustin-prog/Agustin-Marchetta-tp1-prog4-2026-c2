import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { SalaModel, SalaPatch } from "./sala.model";

export interface SalaRow {
    id: number;
    nombre: string;
}

@Injectable({ providedIn: "root"})
export class SalaStore {
    
    private readonly db = supabase;
    readonly salas = signal<SalaModel[]>([]);
    readonly loading = signal(true);

    private yaInicializado = false;

    init() {

        if(this.yaInicializado) return; // guard
        this.yaInicializado = true;

        this.load();
        this.db
        .channel("salas-changes")
        .on("postgres_changes",
            { event: "*", schema: "public", table: "salas" },
            () => this.load()  
        )
        .subscribe();
    }

    async load(): Promise<void> {
        try {
            const { data, error } = await this.db
            .from("salas")
            .select("*")
            .order("id");
    
            if (error) throw error;
    
            this.salas.set((data ?? []));

        } finally {
            this.loading.set(false);
        }
    }

    async add(nombre: string): Promise<void> {
        const { error } = await this.db
          .from("salas")
          .insert({
            nombre: nombre
          });
    
        if (error) throw error;
        
        await this.load();
    }

    async update( id:number, patch: SalaPatch): Promise<void> {
        
        const {error} = await this.db
        .from("salas")
        .update({
            ...(patch.nombreSala !== undefined && { nombre: patch.nombreSala }),
            })
        .eq("id", id);
    
        if(error) throw error;
    
        await this.load();
    }

    async remove( id:number): Promise<void> {
    
        const {data, error} = await this.db
        .from("salas")
        .delete()
        .eq("id", id);
    
        if(error) throw error;
    
        this.salas.set((data ?? []).map((row: SalaRow) => this.mapear(row)));
        await this.load();
    }

    find(id: number): SalaModel | undefined {
        return this.salas().find((s) => Number(s.id) === Number(id));
    }

    private mapear(row: SalaRow): SalaModel {
        return { 
            id: row.id, 
            nombreSala: row.nombre 
        };
    }
}