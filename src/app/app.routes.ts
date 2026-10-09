import { Routes } from '@angular/router';
import { PeliculaDetail } from './peliculas/pelicula-detail/pelicula-detail';
import { PeliculaForm } from './peliculas/pelicula-form/pelicula-form';
import { PeliculaList } from './peliculas/pelicula-list/pelicula-list';
import { CuentaLogin } from './cuenta/login/login';
import { CuentaRegistro } from './cuenta/registro/registro';
import { adminGuard } from './auth/auth.admin';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'peliculas' },

    /* Publico */
    { path: 'peliculas', component: PeliculaList },
    { path: 'peliculas/:peliculaId', component: PeliculaDetail },
    { path: '/funcion/:funcionId/butacas', component:},
    { path: '/compra/confirmacion/:ventaId', component:},

    /* Cuenta */
    { path: 'cuenta/login', component: CuentaLogin },
    { path: 'cuenta/registro', component: CuentaRegistro },

    /* Admin */
    { path: 'admin/peliculas/nueva', component: PeliculaForm, canMatch: [adminGuard] },
    { path: 'admin/peliculas/:peliculaId/editar', component: PeliculaForm, canMatch: [adminGuard] },

    { path: '**', redirectTo: 'peliculas' }
];
