import { ButacaModel } from "../butacas/butaca.model";

export interface SalaModel {
    id: number;
    nombreSala: string;
    /* matrizButacas: ButacaModel[][][]; */
}

export type SalaDraft = Omit<SalaModel, "id">;

export type SalaPatch = Partial<SalaModel>;