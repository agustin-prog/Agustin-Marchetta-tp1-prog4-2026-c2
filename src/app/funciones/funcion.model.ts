export type Formato = '2D' | '3D' | '4D' | '5D';
export type Idioma = 'castellano' | 'subtitulada';

export interface FuncionModel {
    id: number;
    peliculaId: number;
    salaId: number;
    fechaHoraInicio: Date;
    formato: Formato;
    idioma: Idioma;
    precio: number;
}

export interface FuncionPayload {
    peliculaId: number;
    salaId: number;
    fechaHoraInicio: Date;
    formato: Formato;
    idioma: Idioma;
    precio: number;
}

export type FuncionDraft = Omit<FuncionModel, "id">;

export type FuncionPatch = Partial<FuncionModel>;