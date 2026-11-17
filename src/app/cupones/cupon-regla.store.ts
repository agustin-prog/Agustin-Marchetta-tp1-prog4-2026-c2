import { Injectable, inject, signal } from "@angular/core";
import { CuponReglaService } from "./cupon-regla.service";
import { CuponReglaCuponesService } from "./cupon-regla-cupones.service";
import { CuponReglaModel, CuponReglaInput, CuponDisponible } from "./cupon-regla.model";

@Injectable({ providedIn: "root" })
export class CuponReglaStore {
  private readonly service = inject(CuponReglaService);
  private readonly cuponesService = inject(CuponReglaCuponesService);

  readonly reglas = signal<CuponReglaModel[]>([]);
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
    this.reglas.set(data);
  }

  async add(i: CuponReglaInput): Promise<void> {
    await this.service.add(i);
    await this.load();
  }

  async update(id: number, i: CuponReglaInput): Promise<void> {
    await this.service.update(id, i);
    await this.load();
  }

  async cambiarActivo(id: number, activo: boolean): Promise<void> {
    await this.service.cambiarActivo(id, activo);
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await this.service.remove(id);
    await this.load();
  }

  async misDisponibles(perfilId: string): Promise<CuponDisponible[]> {
    return this.cuponesService.misDisponibles(perfilId);
  }
}