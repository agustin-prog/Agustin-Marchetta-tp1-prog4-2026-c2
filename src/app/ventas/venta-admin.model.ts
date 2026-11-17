export interface FiltroVentas {
  desde: string;
  hasta: string;
  estado: 'todas' | 'activas' | 'canceladas';
}

export interface VentaAdminRow {
  id: number;
  total: number;
  estado: string | null;
  qr_codigo: string;
  created_at: string;
  perfil_id: string | null;
  perfiles: { nombre: string | null; apellido: string | null } | null;
  entradas: {
    ocupacion: {
      funciones: {
        fecha_hora_inicio: string;
        peliculas: { nombre: string };
      };
    };
  }[];
  detalle_candy: { cantidad: number }[];
  venta_combos: { cantidad: number }[];
}

export interface VentaAdminModel {
  id: number;
  fecha: string;
  cliente: string;
  pelicula: string;
  funcion: string | null;
  entradas: number;
  conCandy: boolean;
  total: number;
  estado: string;
  qr: string;
}