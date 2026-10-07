export type TipoButaca = 'normal' | 'accesible' | 'VIP';

export interface ButacaModel {
    id: number;
    salaId: number;
    letraFila: string;
    numero: number;
    sector: number;
    tipo: TipoButaca;
}

export interface ButacaPayload {
    salaId: number;
    letraFila: string;
    numero: number;
    sector: number;
    tipo: TipoButaca;
}

export type ButacaDraft = Omit<ButacaModel, "id">;

export type ButacaPatch = Partial<ButacaModel>;
