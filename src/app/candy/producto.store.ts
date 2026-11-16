import { computed, Injectable, inject, signal } from '@angular/core';
import { ProductoService } from './producto.service';
import { ProductoInput, ProductoModel } from './candy.model';

@Injectable({ providedIn: 'root' })
export class ProductoStore {
  private readonly service = inject(ProductoService);

  readonly productos = signal<ProductoModel[]>([]);
  private cargado = false;

  readonly productosActivos = computed(() => this.productos().filter((p) => p.activo));

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
    this.productos.set(data);
  }

  async add(p: ProductoInput): Promise<void> {
    await this.service.add(p);
    await this.load();
  }

  async update(id: number, p: ProductoInput): Promise<void> {
    await this.service.update(id, p);
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await this.service.remove(id);
    await this.load();
  }
}