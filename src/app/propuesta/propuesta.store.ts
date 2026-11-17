import { computed, Injectable, inject, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { PropuestaService, EstadoPropuesta, PropuestaModel } from "./propuesta.service";

export type { EstadoPropuesta, PropuestaModel };

@Injectable({ providedIn: "root" })
export class PropuestaStore {
  private readonly service = inject(PropuestaService);
  private readonly db = supabase;

  readonly mias = signal<PropuestaModel[]>([]);
  readonly pendiente = computed(() => this.mias().some((p) => p.estado === "pendiente"));

  async cargarMias(): Promise<void> {
    const { data: sesion } = await this.db.auth.getSession();
    const userId = sesion.session?.user.id;
    if (!userId) {
      this.mias.set([]);
      return;
    }

    this.mias.set(await this.service.cargarMias(userId));
  }

  async enviar(titulo: string, descripcion: string, motivo: string): Promise<void> {
    await this.service.enviar(titulo, descripcion, motivo);
    await this.cargarMias();
  }

  listar(estado: EstadoPropuesta | "todas"): Promise<PropuestaModel[]> {
    return this.service.listar(estado);
  }

  resolver(id: number, aceptar: boolean): Promise<void> {
    return this.service.resolver(id, aceptar);
  }
}