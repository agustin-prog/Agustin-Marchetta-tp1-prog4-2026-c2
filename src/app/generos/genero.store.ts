import { Injectable, inject, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { GeneroService } from "./genero.service";
import { GeneroModel, GeneroPatch } from "./genero.model";

@Injectable({ providedIn: "root" })
export class GeneroStore {
  private readonly db = supabase;
  private readonly service = inject(GeneroService);

  readonly generos = signal<GeneroModel[]>([]);
  readonly loading = signal(true);

  private yaInicializado = false;

  init() {
    if (this.yaInicializado) return;
    this.yaInicializado = true;

    this.load();
    this.db
      .channel("generos-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "generos" }, () => this.load())
      .subscribe();
  }

  async load(): Promise<void> {
    try {
      const data = await this.service.load();
      this.generos.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  async add(nombre: string): Promise<void> {
    await this.service.add(nombre);
    await this.load();
  }

  async update(id: number, patch: GeneroPatch): Promise<void> {
    await this.service.update(id, patch);
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await this.service.remove(id);
    await this.load();
  }

  find(id: number): GeneroModel | undefined {
    return this.generos().find((g) => Number(g.id) === Number(id));
  }
}