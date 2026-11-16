import { Component, computed, effect, inject, input, numberAttribute, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CompraEnCursoStore } from '../../compra-en-curso.store';
import { ComboStore } from '../../../candy/combo.store';
import { ProductoStore } from '../../../candy/producto.store';
import { CategoriaStore } from '../../../candy/categoria.store';
import { ComboModel } from '../../../candy/candy.model';
import { FuncionStore } from '../../../funciones/funcion.store';
import { ButacaStore } from '../../../butacas/butaca.store';
import { PeliculaStore } from '../../../peliculas/pelicula.store';
import { PrecioArsPipe } from '../../../pipes/pipe-precio-ars/precio-ars-pipe';

@Component({
  imports: [PrecioArsPipe],
  selector: 'app-candy-compra',
  styleUrl: './candy-compra.css',
  templateUrl: './candy-compra.html',
})
export class CandyCompra implements OnDestroy {

  funcionId = input.required({ transform: numberAttribute });

  protected readonly compra = inject(CompraEnCursoStore);
  protected readonly comboStore = inject(ComboStore);
  private readonly productoStore = inject(ProductoStore);
  private readonly categoriaStore = inject(CategoriaStore);
  private readonly router = inject(Router);

  protected readonly categorias = computed(() => {
    const productos = this.productoStore.productosActivos();
    return this.categoriaStore.categorias()
      .map((c) => ({ ...c, productos: productos.filter((p) => p.categoriaId === c.id) }))
      .filter((c) => c.productos.length > 0);
  });

  protected descripcionCombo(combo: ComboModel): string {
    return combo.items
      .map((i) => {
        const nombre = this.productoStore.productos().find((p) => p.id === i.productoId)?.nombre ?? '?';
        return `${i.cantidad} x ${nombre}`;
      })
      .join(', ');
  }

  protected volver() {
    this.compra.transicion = true;
    this.router.navigate(['/funcion', this.funcionId(), 'butacas']).then((ok) => {
      if (!ok) this.compra.transicion = false;
    });
  }

  protected irAlPago() {
    this.compra.transicion = true;
    this.router.navigate(['/funcion', this.funcionId(), 'pago']).then((ok) => {
      if (!ok) this.compra.transicion = false;
    });
  }

  ngOnDestroy() {
    if (this.compra.transicion) {
      this.compra.transicion = false;
      return;
    }
    this.compra.cancelar();
  }

  constructor() {
    effect(() => {
      if (this.compra.funcionId() !== this.funcionId()) {
        this.router.navigate(['/funcion', this.funcionId(), 'butacas']);
      }
    });

    inject(FuncionStore).init();
    inject(ButacaStore).init();
    inject(PeliculaStore).init();
    this.productoStore.init();
    this.categoriaStore.init();
    this.comboStore.init();
  }
}