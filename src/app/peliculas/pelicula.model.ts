import { GeneroModel } from "../generos/genero.model";

export type RestriccionEdad = 'ninguna' | '+13' | '+18';

export interface PeliculaModel {
    id: number;
    nombre: string;
    sinopsis: string;
    duracionMinutos: number;
    restriccionEdad: RestriccionEdad;
    preventaHabilitada: boolean;
    posterUrl: string;              
    fechaEstreno: string;           
    precioPreventa: number | null;
    generos: GeneroModel[];
}

export type PeliculaInput = Omit<PeliculaModel, 'id' | 'generos'> & { generoIds: number[] };