import { GeneroModel } from "../generos/genero.model";

// Solo estos valores son válidos
export type RestriccionEdad = 'ninguna' | '+13' | '+18';

// Entidad central "Película"
export interface PeliculaModel {
    id: number;
    nombre: string;
    sinopsis: string;
    imagenURL: string;
    duracionMinutos: number;
    generos: GeneroModel[];
    restriccionEdad: RestriccionEdad;
}

export type PeliculaDraft = Omit<PeliculaModel, "id">;

export type PeliculaPatch = Partial<PeliculaModel>;