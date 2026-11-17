export interface CuponReglaRow {
  id: number;
  nombre: string;
  descuento_porcentaje: number;
  edad_minima: number | null;
  solo_primera_compra: boolean;
  monto_minimo: number | null;
  vigente_desde: string | null;
  vigente_hasta: string | null;
  activo: boolean;
}

export interface CuponReglaModel {
  id: number;
  nombre: string;
  descuentoPorcentaje: number;
  edadMinima: number | null;
  soloPrimeraCompra: boolean;
  montoMinimo: number | null;
  vigenteDesde: string;          // '' = sin límite
  vigenteHasta: string;          // '' = sin límite
  activo: boolean;
}

export type CuponReglaInput = Omit<CuponReglaModel, 'id' | 'activo'>;

export interface CuponDisponible {
  id: number;
  codigo: string;
  porcentaje: number;
  nombre: string;
  montoMinimo: number | null;
}