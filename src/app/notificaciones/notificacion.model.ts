export interface NotificacionModel {
    id: number;
    tipo: string;
    titulo: string;
    mensaje: string;
    enlace: string | null;
    leida: boolean;
    createdAt: string;
}

export interface NotificacionRow {
    id: number;
    tipo: string;
    titulo: string;
    mensaje: string;
    enlace: string | null;
    leida: boolean;
    created_at: string;
}