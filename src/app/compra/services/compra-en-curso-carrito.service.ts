import { Injectable } from "@angular/core";

const MAX_POR_ITEM = 10;

@Injectable({ providedIn: "root" })
export class CompraEnCursoCarritoService {

    cambiar(actual: Record<number, number>, id: number, delta: number): Record<number, number> {
        const nueva = Math.min(MAX_POR_ITEM, Math.max(0, (actual[id] ?? 0) + delta));
        const copia = { ...actual };

        if (nueva === 0) delete copia[id]; else copia[id] = nueva;
        
        return copia;
    }

    cantidad(actual: Record<number, number>, id: number): number {
        return actual[id] ?? 0;
    }
}