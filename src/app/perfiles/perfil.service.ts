import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { PerfilModel, PerfilRow } from './perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly db = supabase;

  private mapear(row: PerfilRow): PerfilModel {
    return {
      id: row.id,
      nombre: row.nombre,
      apellido: row.apellido,
      fechaNacimiento: row.fecha_nacimiento,
      rol: row.rol,
      puntos: row.puntos,
      credito: row.credito,
      tipoSangre: row.tipo_sangre,
      colorOjos: row.color_ojos,
      diasVacaciones: row.dias_vacaciones,
    };
  }

  async cargar(userId: string): Promise<{ perfil: PerfilModel | null; permisos: string[] }> {
    const [resPerfil, resPermisos] = await Promise.all([
      this.db.from("perfiles").select("*").eq("id", userId).single(),
      this.db.rpc("mis_permisos"),
    ]);

    if (resPerfil.error) throw resPerfil.error;

    const perfil = resPerfil.data ? this.mapear(resPerfil.data as PerfilRow) : null;
    const permisos: string[] = [...((resPermisos.data as string[] | null) ?? [])];

    // el empleado base valida QR por definición
    if (perfil?.rol === "empleado" && !permisos.includes("validacion_qr")) {
      permisos.push("validacion_qr");
    }

    return { perfil, permisos };
  }
}