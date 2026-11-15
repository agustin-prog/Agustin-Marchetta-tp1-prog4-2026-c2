import { Routes } from '@angular/router';
import { PeliculaDetail } from './peliculas/pelicula-detail/pelicula-detail';
import { PeliculaForm } from './admin/peliculas-admin/pelicula-form/pelicula-form';
import { PeliculaList } from './peliculas/pelicula-list/pelicula-list';
import { CuentaLogin } from './cuenta/login/login';
import { CuentaRegistro } from './cuenta/registro/registro';
import { ButacasGrid } from './butacas/butacas-grid/butacas-grid';
import { Confirmacion } from './compra/confirmacion/confirmacion/confirmacion';
import { permisoGuard } from './auth/auth.admin';
import { PeliculaListAdmin } from './admin/peliculas-admin/pelicula-list-admin/pelicula-list-admin';
import { FuncionListAdmin } from './admin/funciones-admin/funcion-list-admin/funcion-list-admin';
import { FuncionForm } from './admin/funciones-admin/funcion-form/funcion-form';
import { ValidarInput } from './validacion/validar-input/validar-input/validar-input';
import { Validacion } from './validacion/validar-empleado/validacion/validacion';
import { empleadoGuard } from './auth/auth.empleado';
import { Proximamente } from './peliculas/proximamente/proximamente/proximamente';
import { CandyNavAdmin } from './admin/candy-admin/candy-nav-admin/candy-nav-admin';
import { ProductosFormAdmin } from './admin/productos-admin/productos-form-admin/productos-form-admin';
import { CombosFormAdmin } from './admin/combos-admin/combos-form-admin/combos-form-admin';
import { CategoriaFormAdmin } from './admin/categorias-admin/categoria-form-admin/categoria-form-admin';
import { CandyCompra } from './compra/candy/candy-compra/candy-compra';
import { PagoCompra } from './compra/pago/pago-compra/pago-compra';
import { Historial } from './cuenta/historial/historial/historial';
import { CuentaPerfil } from './cuenta/perfil/perfil/perfil';
import { CuentaPuntos } from './cuenta/puntos/puntos/puntos';
import { CuentaMisPeliculas } from './cuenta/mis-peliculas/mis-peliculas/mis-peliculas';
import { SalaListAdmin } from './admin/salas-admin/sala-list-admin/sala-list-admin';
import { SalaButacasAdmin } from './admin/salas-admin/sala-butacas-admin/sala-butacas-admin';
import { PromocionesNavAdmin } from './admin/promociones-admin/promociones-nav-admin/promociones-nav-admin';
import { CuponesFormAdmin } from './admin/cupones-admin/cupones-form-admin/cupones-form-admin';
import { RecompensasFormAdmin } from './admin/recompensas-admin/recompensas-form-admin/recompensas-form-admin';
import { VentasListAdmin } from './admin/ventas-admin/ventas-list-admin/ventas-list-admin';
import { ReportesAdmin } from './admin/reportes-admin/reportes-admin/reportes-admin';
import { LogListAdmin } from './admin/log-admin/log-list-admin/log-list-admin';
import { RolesAdmin } from './admin/roles-admin/roles-admin/roles-admin';
import { ProponerPelicula } from './cuenta/proponer/proponer-pelicula/proponer-pelicula';
import { PropuestasListAdmin } from './admin/propuestas-admin/propuestas-list-admin/propuestas-list-admin';
import { ListaEsperaAdmin } from './admin/lista-espera-admin/lista-espera-admin/lista-espera-admin';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'peliculas' },

    /* Público */
    { path: 'peliculas', component: PeliculaList },
    { path: 'proximamente', component: Proximamente },
    { path: 'cuenta/historial', component: Historial },
    { path: 'peliculas/:peliculaId', component: PeliculaDetail },
    { path: 'funcion/:funcionId/butacas', component: ButacasGrid },
    { path: 'funcion/:funcionId/candy', component: CandyCompra },
    { path: 'compra/confirmacion/:qr', component: Confirmacion },
    { path: 'funcion/:funcionId/pago', component: PagoCompra },

    /* Cuenta */
    { path: 'cuenta/*', component: CuentaLogin },
    { path: 'cuenta/login', component: CuentaLogin },
    { path: 'cuenta/registro', component: CuentaRegistro },
    { path: 'cuenta/perfil', component: CuentaPerfil },
    { path: 'cuenta/puntos', component: CuentaPuntos },
    { path: 'cuenta/mis-peliculas', component: CuentaMisPeliculas },
    { path: 'cuenta/proponer', component: ProponerPelicula },

    /* Empleado */
    { path: 'empleado/validar', component: ValidarInput, canMatch: [empleadoGuard] },
    { path: 'empleado/validar/:qr', component: Validacion, canMatch: [empleadoGuard] },

    /* Admin */
    { path: 'admin/peliculas', component: PeliculaListAdmin, canMatch: [permisoGuard('peliculas', 'funciones')] },
    { path: 'admin/peliculas/nueva', component: PeliculaForm, canMatch: [permisoGuard('peliculas')] },
    { path: 'admin/peliculas/:peliculaId/editar', component: PeliculaForm, canMatch: [permisoGuard('peliculas')] },
    { path: 'admin/funciones/:peliculaId', component: FuncionListAdmin, canMatch: [permisoGuard('funciones')] },
    { path: 'admin/funciones/:peliculaId/nueva', component: FuncionForm, canMatch: [permisoGuard('funciones')] },
    { path: 'admin/funciones/:peliculaId/:funcionId/editar', component: FuncionForm, canMatch: [permisoGuard('funciones')] },
    { path: 'admin/candy', component: CandyNavAdmin, canMatch: [permisoGuard('candy_bar', 'combos')],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'productos' },
            { path: 'productos', component: ProductosFormAdmin, canMatch: [permisoGuard('candy_bar')] },
            { path: 'combos', component: CombosFormAdmin, canMatch: [permisoGuard('combos')] },
            { path: 'categorias', component: CategoriaFormAdmin, canMatch: [permisoGuard('candy_bar')] },
        ],
    },
    { path: 'admin/salas', component: SalaListAdmin, canMatch: [permisoGuard('salas')] },
    { path: 'admin/salas/:salaId/butacas', component: SalaButacasAdmin, canMatch: [permisoGuard('salas')] },
    { path: 'admin/promociones', component: PromocionesNavAdmin, canMatch: [permisoGuard('cupones', 'fidelizacion')],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'cupones' },
            { path: 'cupones', component: CuponesFormAdmin, canMatch: [permisoGuard('cupones')] },
            { path: 'recompensas', component: RecompensasFormAdmin, canMatch: [permisoGuard('fidelizacion')] },
        ],
    },
    { path: 'admin/ventas', component: VentasListAdmin, canMatch: [permisoGuard('ventas')] },
    { path: 'admin/reportes', component: ReportesAdmin, canMatch: [permisoGuard('reportes')] },
    { path: 'admin/log', component: LogListAdmin, canMatch: [permisoGuard('log')] },
    { path: 'admin/roles', component: RolesAdmin, canMatch: [permisoGuard('roles')] },
    { path: 'admin/propuestas', component: PropuestasListAdmin, canMatch: [permisoGuard('propuestas')] },
    { path: 'admin/lista-espera', component: ListaEsperaAdmin, canMatch: [permisoGuard('lista_espera')] },

    { path: '**', redirectTo: 'peliculas' }
];