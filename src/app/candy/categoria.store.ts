import { Injectable, inject, signal } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { CategoriaModel } from './candy.model';

@Injectable({ providedIn: 'root' })
export class CategoriaStore {
  private readonly service = inject(CategoriaService);

  readonly categorias = signal<CategoriaModel[]>([]);
  private cargado = false;

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
    this.categorias.set(data);
  }

  async add(nombre: string): Promise<void> {
    await this.service.add(nombre);
    await this.load();
  }

  async update(id: number, nombre: string): Promise<void> {
    await this.service.update(id, nombre);
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await this.service.remove(id);
    await this.load();
  }
}