import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { PerfilStore } from "../perfiles/perfil.store";

export const empleadoGuard: CanMatchFn = () => {
  const perfilStore = inject(PerfilStore);
  const router = inject(Router);
  const rol = perfilStore.perfil()?.rol;
  
  return rol === "admin" || rol === "empleado" || perfilStore.tiene("validacion_qr") || router.createUrlTree(['/peliculas']);
};