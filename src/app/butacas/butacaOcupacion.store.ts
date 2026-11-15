import { Injectable, inject, signal } from '@angular/core';
import { supabase } from '../supabase.client';
import { ButacaOcupacionService } from './butaca-ocupacion.service';
import { ButacaOcupacionModel } from './butacaOcupacion.model';

@Injectable({ providedIn: 'root' })
export class ButacaOcupacionStore {
  private readonly db = supabase;
  private readonly service = inject(ButacaOcupacionService);

  readonly butacasOcupadas = signal<ButacaOcupacionModel[]>([]);
  readonly loading = signal(true);

  readonly token = this.obtenerToken();

  private obtenerToken(): string {
    const guardado = sessionStorage.getItem('tokenCompra');
    if (guardado) return guardado;
    const nuevo = crypto.randomUUID();
    sessionStorage.setItem('tokenCompra', nuevo);
    return nuevo;
  }

  private yaInicializado = false;

  init() {
    this.load();

    if (this.yaInicializado) return;
    this.yaInicializado = true;

    this.db
      .channel('ocupacion-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ocupacion' }, () => this.load())
      .subscribe();
  }

  async load(): Promise<void> {
    const data = await this.service.load();
    this.butacasOcupadas.set(data);
    this.loading.set(false);
  }

  async reservar(funcionId: number, butacaIds: number[]): Promise<number | null> {
    const segundos = await this.service.reservar(funcionId, butacaIds, this.token);
    this.load().catch(() => {});
    return segundos;
  }

  estaNoDisponible(funcionId: number, butacaId: number, ahora: number): boolean {
    return this.butacasOcupadas().some(
      (o) =>
        o.funcionId === funcionId &&
        o.butacaId === butacaId &&
        (o.estado === 'confirmada' ||
          (o.estado === 'reservada' && o.reservadaHasta !== null && o.reservadaHasta > ahora)),
    );
  }

  estaOcupada(funcionId: number, butacaId: number): boolean {
    return this.butacasOcupadas().some(
      (o) => o.funcionId === funcionId && o.butacaId === butacaId && o.estado === 'confirmada',
    );
  }

  porFuncion(funcionId: number): ButacaOcupacionModel[] {
    return this.butacasOcupadas().filter((o) => o.funcionId === funcionId && o.estado === 'confirmada');
  }
}