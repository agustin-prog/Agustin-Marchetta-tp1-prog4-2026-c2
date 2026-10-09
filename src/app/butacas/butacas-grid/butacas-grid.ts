import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FuncionStore } from '../../funciones/funcion.store';
import { ButacaStore } from '../butaca.store';
import { ButacaOcupacionStore } from '../butacaOcupacion.store';
import { CompraStore } from '../../compra/compra.store';
import { PerfilStore } from '../../perfiles/perfil.store';
import { ButacaModel } from '../butaca.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-butacas-grid',
  styleUrl: './butacas-grid.css',
  templateUrl: './butacas-grid.html',
})
export class ButacasGrid {

  funcionId = input.required({ transform: numberAttribute });

  private readonly storeFuncion = inject(FuncionStore);
  private readonly storeButacas = inject(ButacaStore);
  private readonly storeOcupacion = inject(ButacaOcupacionStore);
  private readonly storeCompra = inject(CompraStore);
  private readonly storePerfil = inject(PerfilStore);
  private readonly router = inject(Router);

  readonly seleccionadas = signal<number[]>([]);
  readonly cargando = signal(false);
  readonly errorMsg = signal<string | null>(null);

  /* función actual */
  funcion = computed(() => this.storeFuncion.find(this.funcionId()));

  /* la matriz de butacas de la sala */
  matriz = computed(() => {
    const salaId = this.funcion()?.salaId;
    return salaId ? this.storeButacas.matrizPorSala(salaId) : [];
  });

  estaSeleccionada(butaca: ButacaModel): boolean {
    return this.seleccionadas().includes(butaca.id);
  }

  estaOcupada(butaca: ButacaModel): boolean {
    return this.storeOcupacion.estaOcupada(this.funcionId(), butaca.id);
  }

  elegirButaca(butaca: ButacaModel) {
    const sel = this.seleccionadas();
    const yaEsta = sel.includes(butaca.id);

    if (yaEsta) {
      this.seleccionadas.set(sel.filter(id => id !== butaca.id));
    } else {
      this.seleccionadas.set([...sel, butaca.id]);
    }
  }

  seleccionValida = computed(() => {
    const ids = this.seleccionadas();
    if (ids.length === 0) return false;

    const butacas = this.storeButacas.butacas().filter(b => ids.includes(b.id));
    if (butacas.length !== ids.length) return false;

    /* misma fila */
    const filas = new Set(butacas.map(b => b.letraFila));
    if (filas.size !== 1) return false;

    /* mismo sector */
    const sectores = new Set(butacas.map(b => b.sector));
    if (sectores.size !== 1) return false;

    /* contiguas max - min === cantidad - 1 */
    const numeros = butacas.map(b => b.numero).sort((a, b) => a - b);
    const min = numeros[0];
    const max = numeros[numeros.length - 1];
    return max - min === numeros.length - 1;
  });

  total = computed(() => {
    const precioBase = this.funcion()?.precio ?? 0;
    return this.seleccionadas()
      .map(id => this.storeButacas.butacas().find(b => b.id === id))
      .filter((b): b is ButacaModel => b !== undefined)
      .reduce((sum, b) => sum + (b.tipo === 'VIP' ? precioBase * 1.5 : precioBase), 0);
  });

  async confirmar() {
    if (!this.seleccionValida()) return;

    this.cargando.set(true);
    this.errorMsg.set(null);

    try {
      const qr = await this.storeCompra.confirmarCompra(
        this.funcionId(),
        this.seleccionadas(),
        this.storePerfil.perfil()?.id ?? null,
        this.total(),
        this.funcion()?.precio ?? 0
      );

      this.router.navigate(['/compra/confirmacion', qr]);
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : "Error al confirmar la compra");
    } finally {
      this.cargando.set(false);
    }
  }

  constructor() {
    this.storeFuncion.init();
    this.storeButacas.init();
    this.storeOcupacion.init();
  }
}
