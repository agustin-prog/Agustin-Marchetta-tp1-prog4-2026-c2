export function mensajeDeError(e: unknown, porDefecto = 'Ocurrió un error.'): string {
  if (e && typeof e === 'object') {
    const err = e as { code?: string; message?: string };

    if (err.code === '23503') return 'No se puede eliminar: hay otros registros que dependen de este (funciones, ventas, combos o productos).';
    if (err.code === '23505') return 'Ya existe un registro con ese nombre.';
    if (err.code === '42501') return 'No tenés permisos para hacer esto.';
    if (typeof err.message === 'string') return err.message;
  }
  return porDefecto;
}

export function textoError(e: unknown, defecto: string): string {
  const err = e as { code?: string; message?: string };
  return err?.code === 'P0001' && err.message ? err.message : mensajeDeError(e, defecto);
}