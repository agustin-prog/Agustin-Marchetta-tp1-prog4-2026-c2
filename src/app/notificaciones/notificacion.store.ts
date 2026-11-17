import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { PerfilStore } from "../perfiles/perfil.store";
import { NotificacionService } from "./notificacion.service";
import { NotificacionModel } from "./notificacion.model";

@Injectable({ providedIn: "root" })
export class NotificacionStore {
  private readonly db = supabase;

  private readonly service = inject(NotificacionService);
  private readonly perfilStore = inject(PerfilStore);

  readonly lista = signal<NotificacionModel[]>([]);

  readonly noLeidas = computed(() => this.lista().filter((n) => !n.leida).length);

  constructor() {
    effect(() => {
      const id = this.perfilStore.perfil()?.id;
      if (!id) {
        this.lista.set([]);
        return;
      }
      this.cargar().catch((e) => console.error("No se pudieron cargar las notificaciones", e));
    });

    this.db
      .channel("notificaciones-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notificaciones" }, () => {
        if (this.perfilStore.perfil()) this.cargar().catch(() => {});
      })
      .subscribe();
  }

  async cargar(): Promise<void> {
    const data = await this.service.cargar();
    this.lista.set(data);
  }

  async marcarLeida(id: number): Promise<void> {
    await this.service.marcarLeida(id);
    this.lista.update((l) => l.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  }

  async marcarTodasLeidas(): Promise<void> {
    await this.service.marcarTodasLeidas();
    this.lista.update((l) => l.map((n) => ({ ...n, leida: true })));
  }
}