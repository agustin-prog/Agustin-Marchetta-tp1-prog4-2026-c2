import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ValidacionStore } from '../../validacion.store';
import { VentaValidacion } from '../../validacion.model';
import { FechaPipe } from '../../../pipes/pipe-fecha/fecha-pipe';

@Component({
  imports: [RouterLink, FechaPipe],
  selector: 'app-validacion',
  styleUrl: './validacion.css',
  templateUrl: './validacion.html',
})
export class Validacion {

  qr = input.required<string>();

  private readonly store = inject(ValidacionStore);

  protected readonly bloqueada = signal(false);
  protected readonly venta = signal<VentaValidacion | null | undefined>(undefined);
  protected readonly error = signal<string | null>(null);
  protected readonly procesando = signal(false);

  protected readonly completa = computed(() => {
    const v = this.venta();
    return !!v && v.entradasPendientes === 0 && v.candyPendientes === 0;
  });

  protected validarEntrada() {
    return this.ejecutar((id) => this.store.validarEntradas(id));
  }

  protected validarCandy() {
    return this.ejecutar((id) => this.store.validarCandy(id));
  }

  private async cargar(qr: string, inicial = false) {
    try {
      const v = await this.store.buscarCompra(qr);
      this.venta.set(v);

      if (inicial && v?.consumida) this.bloqueada.set(true);

    } catch (error) {
      this.venta.set(null);
      this.error.set("No se pudo cargar la compra.");
      console.error(error);
    }
  }

  private async ejecutar(accion: (ventaId: number) => Promise<void>) {
    const v = this.venta();
    if (!v) return;

    this.procesando.set(true);
    this.error.set(null);
    try {
      await accion(v.id);
      await this.cargar(this.qr());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : "No se pudo validar.");
    } finally {
      this.procesando.set(false);
    }
  }

  constructor() {
    effect(() => { this.cargar(this.qr(), true); });
  }
}