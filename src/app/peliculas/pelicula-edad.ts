import { fechaLocal } from './pelicula-estado';

export function edadMinimaDe(restriccion: string | undefined): number {
  if (restriccion === '+13') return 13;
  if (restriccion === '+18') return 18;
  return 0;
}

export function calcularEdad(fechaNacimiento: string, hoy = new Date()): number {
  const nacimiento = fechaLocal(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  
  if (hoy < cumpleEsteAnio) edad--;   // todavía no cumplió años este año
  return edad;
}

export function hoyIso(): string {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
}