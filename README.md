# CineApp — Cuentas de prueba

## Descripción del proyecto

Aplicación web de gestión de cine (TP Programación IV). Permite a los clientes
ver la cartelera, elegir funciones, seleccionar butacas y comprar entradas con
código QR; y a los administradores/empleados gestionar la cartelera y validar
accesos.

- **Proyecto:** Agustin-Marchetta-tp1-prog4-2026-c2
- **Deploy:** https://agustin-marchetta-tp1-prog4-2026-c2.vercel.app
- **Stack:** Angular 22 (standalone components, Signals) + Supabase (Postgres, Auth, RLS, Realtime) + Vercel.

## Funcionalidades actuales

- Catálogo de películas con búsqueda y filtro por género.
- Películas más vendidas (top 3).
- Detalle de película con funciones y filtro por fecha.
- Selección de butacas por función (con validación de contigüidad, VIP y accesibles).
- Compra de entradas con generación de QR único.
- Ocupación de butacas en tiempo real (Realtime).
- Autenticación: email/contraseña y OAuth (GitHub / Google).
- Roles (cliente, empleado, admin) con guard de rutas.

## Cuentas de prueba

> ⚠️ Estas cuentas son **solo para demostración** del TP.

| Rol           | Email                        | Contraseña      |
|---------------|------------------------------|-----------------|
| Administrador | `admin@cineapp.com`          | `admin123`      |
| Empleado      | `empleado@cineapp.com`       | `empleado1234`  |

## Cómo probarla

1. Entrar al deploy: https://agustin-marchetta-tp1-prog4-2026-c2.vercel.app
2. Iniciar sesión con una de las cuentas de prueba.
3. Recorrer el flujo: **Cartelera → Película → Función → Butacas → Confirmar compra (QR)**.
Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
