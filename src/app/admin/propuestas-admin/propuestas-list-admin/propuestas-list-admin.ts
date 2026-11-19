import { Component, inject, signal } from "@angular/core";
import { mensajeDeError } from "../../../shared/errores";
import { EstadoPropuesta, PropuestaModel, PropuestaStore } from "../../../propuesta/propuesta.store";
import { PerfilStore } from "../../../perfiles/perfil.store";
import { Router } from "@angular/router";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";

function textoError(error: unknown, defecto: string): string {
  const err = error as { code?: string; message?: string };
  return err?.code === "P0001" && err.message ? err.message : mensajeDeError(error, defecto);
}

@Component({
  imports: [FechaPipe],
  selector: 'app-propuestas-list-admin',
  styleUrl: './propuestas-list-admin.css',
  templateUrl: './propuestas-list-admin.html',
})
export class PropuestasListAdmin {

  private readonly store = inject(PropuestaStore);
  private readonly perfilStore = inject(PerfilStore);
  private readonly router = inject(Router);

  protected readonly filtro = signal<EstadoPropuesta | "todas">("pendiente");
  protected readonly propuestas = signal<PropuestaModel[] | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);

  protected async cargar() {
    this.propuestas.set(null);
    try {
      this.propuestas.set(await this.store.listar(this.filtro()));
    } catch (error) {
      this.error.set(textoError(error, "No se pudieron cargar las propuestas."));
      this.propuestas.set([]);
    }
  }

  protected cambiarFiltro(valor: string) {
    this.filtro.set(valor as EstadoPropuesta | "todas");
    this.cargar();
  }

  protected async aceptar(p: PropuestaModel) {
    if (!confirm(`¿Aceptar la propuesta "${p.titulo}"?`)) return;
    this.error.set(null);
    this.aviso.set(null);

    try {
      await this.store.resolver(p.id, true);

    } catch (error) {

      this.error.set(textoError(error, "No se pudo aceptar la propuesta."));
      return;
    }

    if (this.perfilStore.tiene("peliculas")) {
      this.router.navigate(["/admin/peliculas/nueva"], {
        state: { propuesta: { titulo: p.titulo, sinopsis: p.descripcion } },
      });

    } else {
      this.aviso.set("Propuesta aceptada. Para cargar la película hace falta el permiso de películas.");
      this.cargar();
    }
  }

  protected async rechazar(p: PropuestaModel) {
    if (!confirm(`¿Rechazar la propuesta "${p.titulo}"?`)) return;
    this.error.set(null);
    this.aviso.set(null);

    try {
      await this.store.resolver(p.id, false);
      this.aviso.set("Propuesta rechazada.");
    } catch (error) {
      this.error.set(textoError(error, "No se pudo rechazar la propuesta."));
    }
    this.cargar();
  }

  constructor() {
    this.cargar();
  }
}
