export type Permiso =
  | 'peliculas' | 'funciones' | 'salas' | 'candy_bar' | 'combos' | 'cupones' | 'fidelizacion'
  | 'reportes' | 'ventas' | 'log' | 'propuestas' | 'lista_espera' | 'validacion_qr' | 'roles';

export const PERMISOS_ASIGNABLES: { clave: Permiso; texto: string; detalle: string }[] = [
  { clave: 'peliculas', texto: 'Películas', detalle: 'Películas, géneros y estrenos' },
  { clave: 'funciones', texto: 'Funciones', detalle: 'Crear y eliminar funciones' },
  { clave: 'salas', texto: 'Salas', detalle: 'Salas y distribución de butacas' },
  { clave: 'candy_bar', texto: 'Candy Bar', detalle: 'Productos y categorías' },
  { clave: 'combos', texto: 'Combos', detalle: 'Combos del Candy Bar' },
  { clave: 'cupones', texto: 'Cupones', detalle: 'Cupones y porcentaje de bienvenida' },
  { clave: 'fidelizacion', texto: 'Fidelización', detalle: 'Recompensas y costos en puntos' },
  { clave: 'reportes', texto: 'Reportes', detalle: 'Reportes y exportaciones' },
  { clave: 'ventas', texto: 'Ventas', detalle: 'Listado de todas las ventas' },
  { clave: 'log', texto: 'Log de actividad', detalle: 'Auditoría de acciones' },
  { clave: 'propuestas', texto: 'Propuestas', detalle: 'Propuestas de películas (pantalla próximamente)' },
  { clave: 'lista_espera', texto: 'Lista de espera', detalle: 'Personas en espera por función (pantalla próximamente)' },
  { clave: 'validacion_qr', texto: 'Validación de QR', detalle: 'Validar entradas y candy' },
];

export const SECCIONES: { texto: string; permisos: Permiso[]; ruta: (p: string[]) => string }[] = [
  { texto: 'Admin película', permisos: ['peliculas', 'funciones'], ruta: () => '/admin/peliculas' },
  { texto: 'Admin sala', permisos: ['salas'], ruta: () => '/admin/salas' },
  { texto: 'Admin candy', permisos: ['candy_bar', 'combos'],
    ruta: (p) => p.includes('candy_bar') ? '/admin/candy' : '/admin/candy/combos' },
  { texto: 'Admin promociones', permisos: ['cupones', 'fidelizacion'],
    ruta: (p) => p.includes('cupones') ? '/admin/promociones' : '/admin/promociones/recompensas' },
  { texto: 'Admin ventas', permisos: ['ventas'], ruta: () => '/admin/ventas' },
  { texto: 'Admin reportes', permisos: ['reportes'], ruta: () => '/admin/reportes' },
  { texto: 'Admin log', permisos: ['log'], ruta: () => '/admin/log' },
  { texto: 'Admin roles', permisos: ['roles'], ruta: () => '/admin/roles' },
  { texto: 'Validar QR', permisos: ['validacion_qr'], ruta: () => '/empleado/validar' },
  { texto: 'Admin propuestas', permisos: ['propuestas'], ruta: () => '/admin/propuestas' },
  { texto: 'Admin lista de espera', permisos: ['lista_espera'], ruta: () => '/admin/lista-espera' },
];