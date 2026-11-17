export interface VentaValidacion {
  id: number;
  estado: string;
  qr: string;
  pelicula: string;
  sala: string;
  fechaHoraInicio: string;
  butacas: string[];
  entradasTotal: number;
  entradasPendientes: number;
  candy: { 
    nombre: string; 
    cantidad: number; 
    validada: boolean 
  }[];
  candyPendientes: number;
  consumida: boolean;
}

export interface VentaRow {
  id: number;
  estado: string;
  qr_codigo: string;
  entradas: {
    id: number;
    valida: boolean;
    ocupacion: {
      butacas: { letra_fila: string; numero: number };
      funciones: {
        fecha_hora_inicio: string;
        peliculas: { nombre: string };
        salas: { nombre: string };
      };
    };
  }[];
  detalle_candy: { 
    cantidad: number; 
    validada: boolean; 
    productos: { nombre: string } 
  }[];
  venta_combos: { 
    cantidad: number; 
    validada: boolean; 
    combos: { nombre: string } 
  }[];
}