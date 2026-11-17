import { effect, inject, Injectable, signal } from "@angular/core";
import { PerfilStore } from "../perfiles/perfil.store";
import { AlertaService } from "./alerta.service";

@Injectable({ providedIn: "root" })
export class AlertaStore {
  private readonly perfilStore = inject(PerfilStore);
  private readonly service = inject(AlertaService);

  readonly peliculaIds = signal<ReadonlySet<number>>(new Set());

  constructor() {
    effect(() => { this.cargar(this.perfilStore.perfil()?.id); });
  }

  private async cargar(perfilId: string | undefined) {
    if (!perfilId) {
      this.peliculaIds.set(new Set());
      return;
    }

    try {
      const ids = await this.service.cargar(perfilId);
      this.peliculaIds.set(new Set(ids));
    } catch (error) {
      console.error(error);
    }
  }

  async alternar(peliculaId: number): Promise<void> {
    const perfilId = this.perfilStore.perfil()?.id;
    if (!perfilId) throw new Error("Iniciá sesión para activar alertas.");

    const activa = this.peliculaIds().has(peliculaId);
    await this.service.alternar(perfilId, peliculaId, activa);

    this.peliculaIds.update((ids) => {
      const nuevo = new Set(ids);
      if (activa) {
        nuevo.delete(peliculaId);
      } else {
        nuevo.add(peliculaId);
      }
      return nuevo;
    });
  }
}