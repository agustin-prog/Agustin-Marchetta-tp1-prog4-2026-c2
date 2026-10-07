import { GeneroModel } from "../generos/genero.model";

// Solo estos valores son válidos
export type RestriccionEdad = 'ninguna' | '+13' | '+18';

// Entidad central "Película"
export interface PeliculaModel {
    id: number;
    nombre: string;
    sinopsis: string;
    posterUrl: string;
    duracionMinutos: number;
    generos: GeneroModel[];
    restriccionEdad: RestriccionEdad;
    fechaEstreno: string  | null;
    preventaHabilitada: boolean;
    precioPreventa: number | null;
}

export interface PeliculaPayload {
    nombre: string;
    sinopsis: string;
    duracionMinutos: number;
    restriccionEdad: RestriccionEdad;
    preventaHabilitada: boolean;
    generoIds: number[];
    posterUrl?: string | null;
    fechaEstreno?: string  | null;      
    precioPreventa?: number | null;
}

export type PeliculaDraft = Omit<PeliculaModel, "id">;

export type PeliculaPatch = Partial<PeliculaModel>;