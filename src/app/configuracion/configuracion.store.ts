import { Injectable, inject, signal } from '@angular/core';
import { ConfiguracionService } from './configuracion.service';

@Injectable({ providedIn: 'root' })
export class ConfiguracionStore {
  private readonly service = inject(ConfiguracionService);

  readonly cuponBienvenida = signal(10);

  async cargar(): Promise<void> {
    this.cuponBienvenida.set(await this.service.cargar());
  }

  async guardarCuponBienvenida(porcentaje: number): Promise<void> {
    await this.service.guardarCuponBienvenida(porcentaje);
    this.cuponBienvenida.set(porcentaje);
  }
}