export interface SalaModel {
    id: number;
    nombreSala: string;
    activa: boolean;
}

export interface SalaOcupacion { 
    salaId: number; 
    inicio: number; 
    fin: number; 
}

export type SalaDraft = Omit<SalaModel, "id">;

export type SalaPatch = Partial<SalaModel>;

export interface SalaRow {
    id: number;
    nombre: string;
    activa: boolean;
}
