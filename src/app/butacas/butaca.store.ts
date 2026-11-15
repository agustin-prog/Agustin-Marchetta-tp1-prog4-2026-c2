import { Injectable, inject, signal } from '@angular/core';
import { supabase } from '../supabase.client';
import { ButacaService } from './butaca.service';
import { construirMatriz } from './butaca-generador';
import { ButacaModel } from './butaca.model';

@Injectable({ providedIn: 'root' })
export class ButacaStore {
  private readonly db = supabase;
  private readonly service = inject(ButacaService);

  readonly butacas = signal<ButacaModel[]>([]);
  readonly loading = signal(true);

  private yaInicializado = false;

  init() {
    if (this.yaInicializado) return; // guard
    this.yaInicializado = true;

    this.load();
    this.db
      .channel('butacas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'butacas' }, () => this.load())
      .subscribe();
  }

  async load(): Promise<void> {
    const data = await this.service.load();
    this.butacas.set(data);
    this.loading.set(false);
  }

  async add(salaId: number): Promise<void> {
    await this.service.add(salaId, this.butacas());
    await this.load();
  }

  matrizPorSala(salaId: number): ButacaModel[][][] {
    return construirMatriz(this.butacas().filter((b) => b.salaId === salaId));
  }
}