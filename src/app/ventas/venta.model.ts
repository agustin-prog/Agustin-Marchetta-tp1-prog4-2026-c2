export interface VentaRow {
  id: number;
  qr_codigo: string;
  estado: string;
  total: number;
  created_at: string;
  entradas: {
    valida: boolean;
    ocupacion: {
      butacas: { letra_fila: string; numero: number };
      funciones: {
        fecha_hora_inicio: string;
        formato: string;
        idioma: string;
        peliculas: { nombre: string; poster_url: string | null; restriccion_edad: string };
        salas: { nombre: string };
      };
    };
  }[];
  detalle_candy: { cantidad: number; validada: boolean; productos: { nombre: string } }[];
  venta_combos: { cantidad: number; validada: boolean; combos: { nombre: string } }[];
}

export interface VentaModel {
  id: number;
  qr: string;
  estado: 'activa' | 'cancelada';
  total: number;
  creadaEn: string;
  pelicula: string;
  posterUrl: string;
  restriccion: string;
  sala: string;
  formato: string;
  idioma: string;
  fechaHoraInicio: string;
  butacas: string[];
  candy: string[];
  utilizada: boolean;       
}

export interface PeliculaVista {
  funcionId: number;
  peliculaId: number;
  nombre: string;
  posterUrl: string;
  fecha: string;            
}

const DOS_HORAS = 2 * 60 * 60 * 1000;

export function puedeCancelar(v: VentaModel, ahora = Date.now()): boolean {
  return v.estado === 'activa'
    && !v.utilizada
    && new Date(v.fechaHoraInicio).getTime() - DOS_HORAS > ahora;
}