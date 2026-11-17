import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

interface RolRow {
  id: number;
  nombre: string;
  rol_permisos: { permiso: string }[];
  usuario_roles: { count: number }[];
}

interface UsuarioRow {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string;
  rol: string;
  rol_id: number | null;
  rol_nombre: string | null;
}

export interface RolModel {
  id: number;
  nombre: string;
  permisos: string[];
  usuarios: number;
}

export interface UsuarioRolModel {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  rolId: number | null;
  rolNombre: string | null;
}

@Injectable({ providedIn: "root" })
export class RolService {
  private readonly db = supabase;

  async listar(): Promise<RolModel[]> {
    const { data, error } = await this.db
      .from("roles")
      .select("id, nombre, rol_permisos(permiso), usuario_roles(count)")
      .order("nombre");

    if (error) throw error;

    return (data as unknown as RolRow[]).map((r) => ({
      id: r.id,
      nombre: r.nombre,
      permisos: r.rol_permisos.map((p) => p.permiso),
      usuarios: r.usuario_roles[0]?.count ?? 0,
    }));
  }

  async usuarios(texto: string): Promise<UsuarioRolModel[]> {
    const { data, error } = await this.db.rpc("usuarios_con_roles", { p_texto: texto || null });
    if (error) throw error;

    return (data as UsuarioRow[]).map((u) => ({
      id: u.id,
      nombre: `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim() || "Sin nombre",
      email: u.email,
      rol: u.rol,
      rolId: u.rol_id,
      rolNombre: u.rol_nombre,
    }));
  }

  private async rpc(funcion: string, parametros: Record<string, unknown>): Promise<void> {
    const { error } = await this.db.rpc(funcion, parametros);
    if (error) throw error;
  }

  crear(nombre: string, permisos: string[]) {
    return this.rpc("crear_rol", { p_nombre: nombre, p_permisos: permisos });
  }

  actualizar(id: number, nombre: string, permisos: string[]) {
    return this.rpc("actualizar_rol", { p_rol_id: id, p_nombre: nombre, p_permisos: permisos });
  }

  eliminar(id: number) {
    return this.rpc("eliminar_rol", { p_rol_id: id });
  }

  asignar(perfilId: string, rolId: number) {
    return this.rpc("asignar_rol", { p_perfil_id: perfilId, p_rol_id: rolId });
  }

  quitar(perfilId: string) {
    return this.rpc("quitar_rol", { p_perfil_id: perfilId });
  }

  cambiarBase(perfilId: string, rol: string) {
    return this.rpc("cambiar_rol_base", { p_perfil_id: perfilId, p_rol: rol });
  }
}