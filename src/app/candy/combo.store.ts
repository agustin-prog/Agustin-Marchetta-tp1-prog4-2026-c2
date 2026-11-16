import { computed, Injectable, inject, signal } from '@angular/core';
import { ComboService } from './combo.service';
import { ComboInput, ComboModel } from './candy.model';

@Injectable({ providedIn: 'root' })
export class ComboStore {
  private readonly service = inject(ComboService);

  readonly combos = signal<ComboModel[]>([]);
  private cargado = false;

  readonly combosActivos = computed(() => this.combos().filter((c) => c.activo));

  async cambiarActivo(id: number, activo: boolean): Promise<void> {
    await this.service.cambiarActivo(id, activo);
    await this.load();
  }

  async init(): Promise<void> {
    if (this.cargado) return;
    this.cargado = true;
    try {
      await this.load();
    } catch (e) {
      this.cargado = false;
      console.error(e);
    }
  }

  async load(): Promise<void> {
    const data = await this.service.load();
    this.combos.set(data);
  }

  async add(c: ComboInput): Promise<void> {
    await this.service.add(c);
    await this.load();
  }

  async update(id: number, c: ComboInput): Promise<void> {
    await this.service.update(id, c);
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await this.service.remove(id);
    await this.load();
  }
}