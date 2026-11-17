import { Injectable, inject, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { SalaService } from "./sala.service";
import { SalaButacasService, ButacaSalaModel } from "./sala-butacas.service";
import { SalaModel } from "./sala.model";

@Injectable({ providedIn: "root" })
export class SalaStore {
  private readonly db = supabase;
  private readonly service = inject(SalaService);
  private readonly butacasService = inject(SalaButacasService);

  readonly salas = signal<SalaModel[]>([]);
  readonly loading = signal(true);

  private yaInicializado = false;

  init() {
    if (this.yaInicializado) return;
    this.yaInicializado = true;

    this.load();
    this.db
      .channel("salas-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "salas" }, () => this.load())
      .subscribe();
  }

  async load(): Promise<void> {
    try {
      const data = await this.service.load();
      this.salas.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  async crear(nombre: string): Promise<void> {
    await this.service.crear(nombre);
    await this.load();
  }

  async renombrar(id: number, nombre: string): Promise<void> {
    await this.service.renombrar(id, nombre);
    await this.load();
  }

  async cambiarActiva(id: number, activa: boolean): Promise<void> {
    await this.service.cambiarActiva(id, activa);
    await this.load();
  }

  // falla si la sala tiene funciones, en ese caso hay que desactivarla
  async eliminar(id: number): Promise<void> {
    await this.service.eliminar(id);
    await this.load();
  }

  find(id: number): SalaModel | undefined {
    return this.salas().find((s) => Number(s.id) === Number(id));
  }

  async butacasDe(salaId: number): Promise<ButacaSalaModel[]> {
    return this.butacasService.butacasDe(salaId);
  }

  async cambiarTipoButaca(id: number, tipo: string): Promise<void> {
    await this.butacasService.cambiarTipoButaca(id, tipo);
  }
}