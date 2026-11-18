import { Component, effect, inject, input, numberAttribute, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CompraEnCursoStore } from '../../compra-en-curso.store';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { mensajeDeError } from '../../../shared/errores';
import { PrecioArsPipe } from '../../../pipes/pipe-precio-ars/precio-ars-pipe';

@Component({
  imports: [PrecioArsPipe, RouterLink],
  selector: 'app-pago-compra',
  styleUrl: './pago-compra.css',
  templateUrl: './pago-compra.html',
})
export class PagoCompra implements OnDestroy {

  funcionId = input.required({ transform: numberAttribute });

  protected readonly compra = inject(CompraEnCursoStore);
  private readonly perfilStore = inject(PerfilStore);
  protected readonly perfil = this.perfilStore.perfil;
  private readonly router = inject(Router);

  protected readonly metodos = ['Tarjeta de crédito o débito', 'Mercado Pago', 'Transferencia'];
  protected readonly metodo = signal(this.metodos[0]);

  protected readonly cargando = signal(false);
  protected readonly errorMsg = signal<string | null>(null);

  protected async pagar() {
    this.cargando.set(true);
    this.errorMsg.set(null);

    try {
      if (this.compra.totalFinal() > 0) {
        await new Promise((resolver) => setTimeout(resolver, 1500));
      }

      const qr = await this.compra.pagar();

      const id = this.perfil()?.id ?? null;
      if (id) this.perfilStore.cargar(id).catch(() => {});

      this.router.navigate(['/compra/confirmacion', qr]);
    } catch (error) {
      this.errorMsg.set(mensajeDeError(error, "No se pudo completar el pago"));
    } finally {
      this.cargando.set(false);
    }
  }

  protected volver() {
    this.compra.transicion = true;
    this.router.navigate(['/funcion', this.funcionId(), 'candy']).then((ok) => {
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

    effect(() => { this.compra.cargarDescuentos(this.perfil()?.id); });
  }
}
