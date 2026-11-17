import { inject, Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { ButacaOcupacionStore } from "../butacas/butacaOcupacion.store";
import { AdminRow, ListaEsperaAdminModel, ListaEsperaModel, TurnoTomado, UsuarioRow } from "./lista-espera.model";

@Injectable({ providedIn: "root" })
export class ListaEsperaService {

    private readonly db = supabase;
    private readonly ocupacion = inject(ButacaOcupacionStore);

    async cargarUsuario(): Promise<ListaEsperaModel[]> {
        const { data, error } = await this.db.rpc("mi_lista_espera");

        if (error) throw error;

        return (data ?? []).map((r: UsuarioRow) => ({
            id: r.id,
            funcionId: r.funcion_id,
            peliculaId: r.pelicula_id,
            pelicula: r.pelicula,
            fechaHoraInicio: r.fecha_hora_inicio,
            formato: r.formato,
            estado: r.estado,
            posicion: r.posicion,
            butacaId: r.butaca_id,
            turnoVenceAt: r.turno_vence_at ? new Date(r.turno_vence_at).getTime() : null,
        }));
    }

    async cargarAdmin(): Promise<ListaEsperaAdminModel[]> {
        const { data, error } = await this.db.rpc("admin_lista_espera");

        if (error) throw error;

        return (data ?? []).map((r: AdminRow) => ({
            funcionId: r.funcion_id,
            pelicula: r.pelicula,
            sala: r.sala,
            fechaHoraInicio: r.fecha_hora_inicio,
            formato: r.formato,
            esperando: r.esperando,
            conTurno: r.con_turno,
        }));
    }

    async unirse(funcionId: number): Promise<void> {
        const { error } = await this.db.rpc("unirse_lista_espera", { p_funcion_id: funcionId });
        if (error) throw new Error(error.message);
    }

    async salir(funcionId: number): Promise<void> {
        const { error } = await this.db.rpc("salir_lista_espera", { p_funcion_id: funcionId });
        if (error) throw new Error(error.message);
    }

    async tomarTurno(funcionId: number): Promise<TurnoTomado> {
        const { data, error } = await this.db.rpc("tomar_turno", {
            p_funcion_id: funcionId,
            p_token: this.ocupacion.token,
        });

        if (error) throw new Error(error.message);

        this.ocupacion.load().catch(() => {});
        return { butacaId: data.butaca_id, segundos: data.segundos };
    }
}