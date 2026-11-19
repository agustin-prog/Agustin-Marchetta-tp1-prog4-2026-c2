import { Component, inject, signal } from "@angular/core";
import { mensajeDeError } from "../../../shared/errores";
import { RolModel, RolService, UsuarioRolModel } from "../../../roles/rol.service";
import { PERMISOS_ASIGNABLES } from "../../../auth/secciones-admin";

function textoError(error: unknown, defecto: string): string {
  const err = error as { code?: string; message?: string };
  return err?.code === "P0001" && err.message ? err.message : mensajeDeError(error, defecto);
}

@Component({
  imports: [],
  selector: 'app-roles-admin',
  styleUrl: './roles-admin.css',
  templateUrl: './roles-admin.html',
})
export class RolesAdmin {

  private readonly store = inject(RolService);

  protected readonly permisos = PERMISOS_ASIGNABLES;
  protected readonly pestana = signal<"roles" | "usuarios">("roles");
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);

  protected readonly roles = signal<RolModel[] | null>(null);
  protected readonly editandoId = signal<number | null>(null);
  protected readonly nombre = signal("");
  protected readonly elegidos = signal<string[]>([]);
  protected readonly guardando = signal(false);

  protected readonly texto = signal("");
  protected readonly usuarios = signal<UsuarioRolModel[] | null>(null);

  protected nombresPermisos(claves: string[]): string {
    return this.permisos.filter((p) => claves.includes(p.clave)).map((p) => p.texto).join(", ");
  }

  private limpiarMensajes() {
    this.error.set(null);
    this.aviso.set(null);
  }

  private async cargarRoles() {
    try {
      this.roles.set(await this.store.listar());
    } catch (error) {
      this.error.set(textoError(error, "No se pudieron cargar los roles."));
      this.roles.set([]);
    }
  }

  protected alternar(clave: string) {
    this.elegidos.update((lista) =>
      lista.includes(clave) ? lista.filter((x) => x !== clave) : [...lista, clave],
    );
  }

  protected editar(rol: RolModel) {
    this.limpiarMensajes();
    this.editandoId.set(rol.id);
    this.nombre.set(rol.nombre);
    this.elegidos.set([...rol.permisos]);
  }

  protected cancelarEdicion() {
    this.editandoId.set(null);
    this.nombre.set("");
    this.elegidos.set([]);
  }

  protected async guardar(evento: Event) {
    evento.preventDefault();
    this.limpiarMensajes();

    const nombre = this.nombre().trim();
    if (nombre.length < 2) {
      this.error.set("El nombre del rol debe tener al menos 2 caracteres.");
      return;
    }

    if (this.elegidos().length === 0) {
      this.error.set("Elegí al menos un permiso.");
      return;
    }

    this.guardando.set(true);
    try {
      const rolId = this.editandoId();

      if (rolId === null) {
        await this.store.crear(nombre, this.elegidos());
        this.aviso.set(`Rol "${nombre}" creado.`);

      } else {
        await this.store.actualizar(rolId, nombre, this.elegidos());
        this.aviso.set(`Rol "${nombre}" actualizado.`);
      }

      this.cancelarEdicion();
      await this.cargarRoles();

    } catch (error) {
      this.error.set(textoError(error, "No se pudo guardar el rol."));
    } finally {
      this.guardando.set(false);
    }
  }

  protected async eliminar(rol: RolModel) {
    if (!confirm(`¿Eliminar el rol "${rol.nombre}"?`)) return;
    this.limpiarMensajes();

    try {
      await this.store.eliminar(rol.id);
      this.aviso.set(`Rol "${rol.nombre}" eliminado.`);

      if (this.editandoId() === rol.id) this.cancelarEdicion();

      await this.cargarRoles();
    } catch (error) {
      this.error.set(textoError(error, "No se pudo eliminar el rol."));
    }
  }

  protected async cargarUsuarios() {
    try {
      this.usuarios.set(await this.store.usuarios(this.texto().trim()));
    } catch (error) {
      this.error.set(textoError(error, "No se pudieron cargar los usuarios."));
      this.usuarios.set([]);
    }
  }

  protected irAUsuarios() {
    this.limpiarMensajes();
    this.pestana.set("usuarios");
    this.cargarRoles();
    this.cargarUsuarios();
  }

  protected async cambiarPersonalizado(u: UsuarioRolModel, valorSeleccionado: string) {
    this.limpiarMensajes();

    try {
      if (valorSeleccionado === "") {
        await this.store.quitar(u.id);
        this.aviso.set(`Se quitó el rol a ${u.nombre}.`);

      } else {
        await this.store.asignar(u.id, Number(valorSeleccionado));
        this.aviso.set(`Rol asignado a ${u.nombre}.`);

      }
      await Promise.all([this.cargarUsuarios(), this.cargarRoles()]);
    } catch (error) {
      this.error.set(textoError(error, "No se pudo cambiar el rol."));
      await this.cargarUsuarios();
    }
  }

  protected async cambiarBase(u: UsuarioRolModel, rolBase: string) {
    if (!confirm(`¿Cambiar el rol base de ${u.nombre} a "${rolBase}"?`)) {
      await this.cargarUsuarios();
      return;
    }

    this.limpiarMensajes();
    try {
      
      await this.store.cambiarBase(u.id, rolBase);
      this.aviso.set(`Rol base de ${u.nombre} actualizado.`);
    } catch (error) {
      this.error.set(textoError(error, "No se pudo cambiar el rol base."));
    }
    await Promise.all([this.cargarUsuarios(), this.cargarRoles()]);
  }

  constructor() {
    this.cargarRoles();
  }
}
