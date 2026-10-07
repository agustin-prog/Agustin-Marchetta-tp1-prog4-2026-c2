import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { GeneroModel, GeneroPatch } from "./genero.model";

@Injectable({ providedIn: "root" })
export class GeneroStore {

    private readonly db = supabase;
    readonly generos = signal<GeneroModel[]>([]);
    readonly loading = signal(true);

    private yaInicializado = false;

    init() {

        if(this.yaInicializado) return; // guard
        this.yaInicializado = true;

        this.load();
        this.db
        .channel("generos-changes")
        .on("postgres_changes",
            { event: "*", schema: "public", table: "generos" },
            () => this.load()  
        )
        .subscribe();
    }

    async load(): Promise<void> {
        try {
            const { data, error } = await this.db
            .from("generos")
            .select("*")
            .order("id");
    
            if (error) throw error;
    
            this.generos.set((data ?? []));

        } finally {
            this.loading.set(false);
        }
    }

    async add(nombre: string): Promise<void> {
        const { error } = await this.db
          .from("generos")
          .insert({
            nombre: nombre
          });
    
        if (error) throw error;
    
        await this.load();
    }

    async update( id:number, patch: GeneroPatch): Promise<void> {
    
        const {error} = await this.db
        .from("generos")
        .update({
            ...(patch.nombre !== undefined && { nombre: patch.nombre }),
          })
        .eq("id", id);
    
        if(error) throw error;
    
        await this.load();
    }

    async remove( id:number): Promise<void> {
    
        const {error} = await this.db
        .from("generos")
        .delete()
        .eq("id", id);
    
        if(error) throw error;
    
        await this.load();
    }
    
    find(id: number): GeneroModel | undefined {
    return this.generos().find((g) => Number(g.id) === Number(id));
    }
}