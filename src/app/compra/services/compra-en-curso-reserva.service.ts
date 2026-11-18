import { inject, Injectable } from "@angular/core";
import { ButacaOcupacionStore } from "../../butacas/butacaOcupacion.store";

@Injectable({ providedIn: "root" })
export class CompraEnCursoReservaService {

    private readonly ocupacion = inject(ButacaOcupacionStore);
    
    fijarReserva( store: any, funcionId: number, butacaIds: number[], segundos: number | null ): void {
        
        if (butacaIds.length === 0 || segundos === null) {
            this.limpiar(store);
            return;
        }

        store.funcionId.set(funcionId);
        store.butacaIds.set(butacaIds);
        store.venceEn.set(Date.now() + segundos * 1000);
        store.ahora.set(Date.now());
        store.intervalo ??= setInterval(() => store.ahora.set(Date.now()), 1000);
    }

    async cancelar(store: any, funcionId?: number): Promise<void> {
        const id = funcionId ?? store.funcionId();
        this.limpiar(store);

        if (id !== null && id !== undefined) {
        await this.ocupacion.reservar(id, []).catch(() => {});
        }
    }

    limpiar(store: any): void {
        clearInterval(store.intervalo);
        store.intervalo = undefined;
        store.funcionId.set(null);
        store.butacaIds.set([]);
        store.venceEn.set(null);
        store.productos.set({});
        store.combos.set({});
        store.fechaNacimiento.set(null);
        store.cuponBienvenida.set(null);
        store.usarCredito.set(false);
        store.usarEntradaGratis.set(false);
        store.entradasGratis.set(0);
        store.cuponesPersonales.set([]);
        store.cuponElegidoId.set(null);
    }
}