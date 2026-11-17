export interface RecompensaRow {
  id: number;
  nombre: string;
  costo_puntos: number;
  producto_id: number | null;
  activa: boolean;
  productos: { nombre: string } | null;
}

export interface RecompensaModel {
  id: number;
  nombre: string;
  costoPuntos: number;
  productoId: number | null;       // null = entrada gratis
  productoNombre: string;
  activa: boolean;
}

export type RecompensaInput = { nombre: string; costoPuntos: number; productoId: number | null };

export interface CanjeRow {
  id: number;
  created_at: string;
  venta_id: number | null;
  recompensas: { nombre: string; costo_puntos: number; producto_id: number | null };
  ventas: { qr_codigo: string; detalle_candy: { validada: boolean }[] } | null;
}

export interface CanjeModel {
  id: number;
  fecha: string;
  recompensa: string;
  costoPuntos: number;
  esEntrada: boolean;
  qr: string | null;
  estado: string;
}