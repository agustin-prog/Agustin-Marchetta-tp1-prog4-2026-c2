import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { ButacaOcupacionModel, EstadoButaca } from "./butacaOcupacion.model";

export interface ButacaOcupacionRow {
    id: number;
    funcion_id: number;
    butaca_id: number;
    estado: EstadoButaca;
}

@Injectable({ providedIn: "root" })
export class ButacaOcupacionStore {

    private readonly db = supabase;
    readonly butacasOcupadas = signal<ButacaOcupacionModel[]>([]);
    readonly loading = signal(true);

    private yaInicializado = false;

    init() {
        this.load();

        if (this.yaInicializado) return;
        this.yaInicializado = true;

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

        this.butacasOcupadas.set((data ?? []).map((row: ButacaOcupacionRow) => this.mapear(row)));
        this.loading.set(false);
    }

    async add(funcionId: number, butacaId: number): Promise<void> {
        const { error } = await this.db
            .from("ocupacion")
            .insert({
                funcion_id: funcionId,
                butaca_id: butacaId,
                estado: "confirmada" as EstadoButaca,
            });

        if (error) throw error;
        await this.load();
    }

    estaOcupada(funcionId: number, butacaId: number): boolean {
        return this.butacasOcupadas().some(
            o => o.funcionId === funcionId && o.butacaId === butacaId && o.estado === 'confirmada'
        );
    }

    porFuncion(funcionId: number): ButacaOcupacionModel[] {
        return this.butacasOcupadas().filter(
            o => o.funcionId === funcionId && o.estado === 'confirmada'
        );
    }

    private mapear(row: ButacaOcupacionRow): ButacaOcupacionModel {
        return {
            id: row.id,
            funcionId: row.funcion_id,
            butacaId: row.butaca_id,
            estado: row.estado,
        };
    }
}
