import { Injectable, inject, signal } from '@angular/core';
import { supabase } from '../supabase.client';
import { PeliculaService } from './pelicula.service';
import { PeliculaInput, PeliculaModel } from './pelicula.model';

@Injectable({ providedIn: 'root' })
export class PeliculaStore {
  private readonly db = supabase;
  private readonly service = inject(PeliculaService);

  readonly peliculas = signal<PeliculaModel[]>([]);
  readonly loading = signal(true);

  private yaInicializado = false;

  init() {
    if (this.yaInicializado) return; // guard
    this.yaInicializado = true;

    this.load();
    this.db
      .channel('peliculas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'peliculas' }, () => this.load())
      .subscribe();
  }

  async load(): Promise<void> {
    const data = await this.service.load();
    this.peliculas.set(data);
    this.loading.set(false);
  }

  find(id: number): PeliculaModel | undefined {
    return this.peliculas().find((p) => Number(p.id) === Number(id));
  }

  async add(input: PeliculaInput): Promise<void> {
    await this.service.add(input);
    await this.load();
  }

  async update(id: number, input: PeliculaInput): Promise<void> {
    await this.service.update(id, input);
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await this.service.remove(id);
    await this.load();
  }
}