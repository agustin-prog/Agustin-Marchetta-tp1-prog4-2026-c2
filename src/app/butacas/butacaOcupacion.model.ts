
export type EstadoButaca = 'reservada' | 'confirmada' | 'liberada';

export interface ButacaOcupacionModel {
    id: number;
    funcionId: number,
    butacaId: number,
    estado: EstadoButaca,
}

export interface ButacaOcupacionPayload {
    funcionId: number,
    butacaId: number,
    estado: EstadoButaca,
}

export type ButacaDraft = Omit<ButacaOcupacionModel, "id">;

export type ButacaPatch = Partial<ButacaOcupacionModel>;