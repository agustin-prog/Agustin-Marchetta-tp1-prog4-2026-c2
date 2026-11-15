import { PeliculaModel } from './pelicula.model';

export const DIAS_PREVENTA = 7;

export type EstadoPelicula = 'cartelera' | 'preventa' | 'proximamente' | 'fuera';

const MS_DIA = 24 * 60 * 60 * 1000;

export function fechaLocal(iso: string): Date {
  const [anio, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function sinEstrenar(p: PeliculaModel, ahora = Date.now()): boolean {
  return !!p.fechaEstreno && fechaLocal(p.fechaEstreno).getTime() > ahora;
}

export function enPreventa(p: PeliculaModel, ahora = Date.now()): boolean {
  if (!p.preventaHabilitada || p.precioPreventa == null || !sinEstrenar(p, ahora)) return false;

  const dias = (fechaLocal(p.fechaEstreno!).getTime() - ahora) / MS_DIA;
  return dias <= DIAS_PREVENTA;
}

export function estadoPelicula(p: PeliculaModel, tieneFunciones: boolean, ahora = Date.now()): EstadoPelicula {
  if (enPreventa(p, ahora)) return tieneFunciones ? 'preventa' : 'proximamente';
  if (sinEstrenar(p, ahora)) return 'proximamente';

  return tieneFunciones ? 'cartelera' : 'fuera';
}