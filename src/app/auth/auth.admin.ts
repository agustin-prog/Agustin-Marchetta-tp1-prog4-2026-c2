import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { PerfilStore } from '../perfiles/perfil.store';
import { Permiso } from './secciones-admin';

export const permisoGuard = (...permisos: Permiso[]): CanMatchFn => () => {
  const perfilStore = inject(PerfilStore);
  const router = inject(Router);
  
  return permisos.some((p) => perfilStore.tiene(p)) || router.createUrlTree(['/peliculas']);
};