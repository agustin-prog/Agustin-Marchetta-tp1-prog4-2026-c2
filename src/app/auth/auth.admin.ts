import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { PerfilStore } from '../perfiles/perfil.store';

export const adminGuard: CanMatchFn = (): boolean | UrlTree => {

    const perfilStore = inject(PerfilStore);
    const router = inject(Router);

    const rol = perfilStore.perfil()?.rol;
    return rol === "admin" || router.createUrlTree(["/peliculas"]);
}