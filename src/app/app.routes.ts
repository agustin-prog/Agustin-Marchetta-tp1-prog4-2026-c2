import { Routes } from '@angular/router';
import { PeliculaDetail } from './peliculas/pelicula-detail/pelicula-detail';
import { PeliculaForm } from './peliculas/pelicula-form/pelicula-form';
import { PeliculaList } from './peliculas/pelicula-list/pelicula-list';
import { ComponenteTest } from './salas/componente-test/componente-test';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'peliculas' },

    /* Publico */
    { path: 'peliculas', component: PeliculaList },
    { path: 'peliculas/:peliculaId', component: PeliculaDetail },

    /* Admin */
    //{ path: 'admin/peliculas', component:  },
    { path: 'admin/peliculas/nueva', component: PeliculaForm  },
    { path: 'admin/peliculas/:peliculaId/editar', component: PeliculaForm },
    { path: 'admin/salas', component: ComponenteTest },

    { path: '**', redirectTo: 'peliculas' }
];
