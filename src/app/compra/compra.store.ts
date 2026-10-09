import { inject, Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { ButacaOcupacionStore } from "../butacas/butacaOcupacion.store";

@Injectable({ providedIn: "root" })
export class CompraStore {

    private readonly db = supabase;
    private readonly storeOcupacion = inject(ButacaOcupacionStore);

    async confirmarCompra(
        funcionId: number,
        butacaIds: number[],
        perfilId: string | null,
        total: number,
        precioBase: number
    ): Promise<string> {

        const qr = crypto.randomUUID();
        const { data: venta, error: errorVenta } = await this.db
            .from("ventas")
            .insert({
                perfil_id: perfilId,      // null si es anónimo
                total,
                qr_codigo: qr,
                estado: "activa",
            })
            .select()
            .single();

        if (errorVenta) throw errorVenta;

        for (const butacaId of butacaIds) {
            
            const { data: ocupacion, error: errorOcupacion } = await this.db
                .from("ocupacion")
                .insert({
                    funcion_id: funcionId,
                    butaca_id: butacaId,
                    estado: "confirmada",
                })
                .select()
                .single();

            if (errorOcupacion) throw errorOcupacion;

            const { error: errorEntrada } = await this.db
                .from("entradas")
                .insert({
                    venta_id: venta.id,
                    ocupacion_id: ocupacion.id,
                    precio: precioBase,
                    valida: false,
                });

            if (errorEntrada) throw errorEntrada;
        }

        await this.storeOcupacion.porFuncion(funcionId);

        return qr;
    }
}
