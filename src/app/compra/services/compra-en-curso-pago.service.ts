import { inject, Injectable } from "@angular/core";
import { CompraStore } from "../compra.store";

@Injectable({ providedIn: "root" })
export class CompraEnCursoPagoService {
    private readonly compraStore = inject(CompraStore);

    async pagar(
        funcionId: number,
        butacaIds: number[],
        productos: Record<number, number>,
        combos: Record<number, number>,
        usarCredito: boolean,
        fechaNacimiento: string | null,
        usarEntradaGratis: boolean,
        cuponId: number | null,

    ): Promise<string> {

        if (funcionId === null) throw new Error("No hay una compra en curso.");

        const qr = await this.compraStore.confirmarCompra(funcionId, butacaIds, {
            productos: Object.entries(productos).map(([id, cantidad]) => ({ producto_id: Number(id), cantidad })),
            combos: Object.entries(combos).map(([id, cantidad]) => ({ combo_id: Number(id), cantidad })),
            usarCredito,
            fechaNacimiento: fechaNacimiento ?? undefined,
            usarEntradaGratis,
            cuponId: cuponId ?? undefined,
        });

        return qr;
    }
}