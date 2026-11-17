export interface NotificacionModel {
    id: number;
    tipo: string;
    titulo: string;
    mensaje: string;
    enlace: string | null;
    leida: boolean;
    createdAt: string;
}