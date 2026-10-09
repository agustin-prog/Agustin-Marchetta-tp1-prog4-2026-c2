import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

@Injectable({ providedIn: "root" })
export class ReporteStore {

    private readonly db = supabase;

    async topPeliculas(cantidad: number): Promise<{ peliculaId: number; cantidad: number }[]> {
        const { data, error } = await this.db
            .from("ocupacion")
            .select("funcion_id, funciones(pelicula_id)")
            .eq("estado", "confirmada");

        if (error) throw error;

        const conteoButacas = new Map<number, number>();

        (data ?? []).forEach((o: any) => {

            const peliculaId = o.funciones?.pelicula_id;

            if (peliculaId) {

                conteoButacas.set(peliculaId, (conteoButacas.get(peliculaId) ?? 0) + 1);
            }
        });

        return Array.from(conteoButacas.entries())
        .map(([peliculaId, cantidad]) => ({ peliculaId, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, cantidad);
    }
}
