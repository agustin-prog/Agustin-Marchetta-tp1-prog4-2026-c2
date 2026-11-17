import { inject, Injectable } from "@angular/core";
import { CuponBienvenida, CuponStore } from "../../cupones/cupon.store";
import { RecompensaStore } from "../../fidelizacion/recompensa.store";
import { CuponDisponible } from "../../cupones/cupon-regla.model";
import { CuponReglaStore } from "../../cupones/cupon-regla.store";

@Injectable({ providedIn: 'root' })
export class CompraEnCursoDescuentosService {

    private readonly cuponStore = inject(CuponStore);
    private readonly recompensaStore = inject(RecompensaStore);
    private readonly cuponReglaStore = inject(CuponReglaStore);

    async cargarDescuentos(perfilId: string | undefined): Promise<{ 
        cupon: CuponBienvenida | null; 
        entradas: number; 
        personales: CuponDisponible[];
    }> {

        if (!perfilId) {
            return { cupon: null, entradas: 0, personales: [] };
        }

        const [cupon, entradas, personales] = await Promise.all([
            this.cuponStore.bienvenidaDisponible(perfilId).catch(() => null),
            this.recompensaStore.entradasGratisPendientes(perfilId).catch(() => 0),
            this.cuponReglaStore.misDisponibles(perfilId).catch(() => [] as CuponDisponible[]),
        ]);
        return { cupon, entradas, personales };
    }

    elegirCupon(valor: string): number | null {
        return valor ? Number(valor) : null;
    }
}