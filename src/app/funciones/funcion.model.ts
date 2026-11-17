import { SalaOcupacion } from "../salas/sala.model";

export type Formato = '2D' | '3D' | '4D' | '5D';
export type Idioma = 'castellano' | 'subtitulada';

export interface FuncionModel {
    id: number;
    peliculaId: number;
    salaId: number;
    fechaHoraInicio: string;
    formato: Formato;
    idioma: Idioma;
    precio: number;
    cancelada: boolean;
}

export interface FuncionFormInput {
    peliculaId: number;
    duracionMin: number;
    fechaDesde: string;   
    fechaHasta: string;
    horaDesde: string;    
    horaHasta: string;
    salaIds: number[];
    ocupadas: SalaOcupacion[];
    formato: Formato;
    idioma: Idioma;
    precio: number;
}

export type FuncionInput = Omit<FuncionModel, 'id' | 'cancelada'>;

export interface ResumenCancelacion {
    comprasRegistradas: number;
    comprasAnonimas: number;
    totalAAcreditar: number;
}

export interface ResultadoCancelacion {
    comprasRegistradas: number;
    comprasAnonimas: number;
    totalAcreditado: number;
}

export interface CompraAnonima {
    ventaId: number;
    qr: string;
    fecha: string;
    entradas: number;
    total: number;
}