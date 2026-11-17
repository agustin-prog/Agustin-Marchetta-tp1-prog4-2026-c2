export interface GeneroModel {
    id: number;
    nombre: string;
}

export type GeneroDraft = Omit<GeneroModel, "id">;

export type GeneroPatch = Partial<GeneroModel>;