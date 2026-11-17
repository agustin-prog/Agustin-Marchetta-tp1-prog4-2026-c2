import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { CompraAnonima, ResultadoCancelacion, ResumenCancelacion } from "./funcion.model";

@Injectable({ providedIn: "root" })
export class FuncionRpcService {
    private readonly db = supabase;

    async resumenCancelacion(id: number): Promise<ResumenCancelacion> {
        const { data, error } = await this.db.rpc("resumen_cancelacion", { p_funcion_id: id });
        if (error) throw error;

        return {
            comprasRegistradas: data.compras_registradas,
            comprasAnonimas: data.compras_anonimas,
            totalAAcreditar: Number(data.total_a_acreditar),
        };
    }

    async cancelar(id: number): Promise<ResultadoCancelacion> {
        const { data, error } = await this.db.rpc("cancelar_funcion", { p_funcion_id: id });
        if (error) throw error;

        return {
            comprasRegistradas: data.compras_registradas,
            comprasAnonimas: data.compras_anonimas,
            totalAcreditado: Number(data.total_acreditado),
        };
    }

    async comprasAnonimas(id: number): Promise<CompraAnonima[]> {
        const { data, error } = await this.db.rpc("compras_anonimas_funcion", { p_funcion_id: id });
        if (error) throw error;

        return (data ?? []).map((r: { venta_id: number; qr_codigo: string; fecha: string; entradas: number; total: number }) => ({
            ventaId: r.venta_id,
            qr: r.qr_codigo,
            fecha: r.fecha,
            entradas: Number(r.entradas),
            total: Number(r.total),
        }));
    }
}