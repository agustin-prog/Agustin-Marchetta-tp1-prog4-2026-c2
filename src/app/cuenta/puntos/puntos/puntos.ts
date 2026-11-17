import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecompensaStore } from '../../../fidelizacion/recompensa.store';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { CanjeModel, RecompensaModel } from '../../../fidelizacion/recompensa.model';
import { mensajeDeError } from '../../../errores';
import { descargarComprobante } from '../../../compra/comprobante';
import { FechaPipe } from '../../../pipes/pipe-fecha/fecha-pipe';

@Component({
  imports: [RouterLink, FechaPipe],
  selector: 'app-puntos',
  styleUrl: './puntos.css',
  templateUrl: './puntos.html',
})
export class CuentaPuntos {

  private readonly recompensaStore = inject(RecompensaStore);
  private readonly perfilStore = inject(PerfilStore);
  protected readonly perfil = this.perfilStore.perfil;

  protected readonly recompensas = signal<RecompensaModel[]>([]);
  protected readonly canjes = signal<CanjeModel[] | null>(null);
  protected readonly canjeando = signal<number | null>(null);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected puedeCanjear(r: RecompensaModel): boolean {
    return (this.perfil()?.puntos ?? 0) >= r.costoPuntos;
  }

  protected async canjear(r: RecompensaModel) {
    if (!confirm(`¿Canjear ${r.costoPuntos} puntos por "${r.nombre}"?`)) return;

    this.canjeando.set(r.id);
    this.error.set(null);
    this.mensaje.set(null);

    try {
      const qr = await this.recompensaStore.canjear(r.id);
      this.mensaje.set(qr
        ? `¡Listo! Canjeaste "${r.nombre}". Presentá el código en el candy bar: lo encontrás abajo y en tus compras.`
        : `¡Listo! Canjeaste "${r.nombre}". Vas a poder usarla al pagar tu próxima compra.`);

      const id = this.perfil()?.id;
      if (id) {
        this.perfilStore.cargar(id).catch(() => {});
        await this.cargarCanjes(id);
      }

    } catch (error) {
      this.error.set(mensajeDeError(error, 'No se pudo realizar el canje.'));
      this.cargarRecompensas();
    } finally {
      this.canjeando.set(null);
    }
  }

  protected descargar(c: CanjeModel) {
    if (!c.qr) return;
    descargarComprobante({ qr: c.qr, candy: [`1 x ${c.recompensa} (canje)`], total: 0 })
      .catch((error) => console.error(error));
  }

  private async cargarCanjes(perfilId: string) {
    try {
      this.canjes.set(await this.recompensaStore.misCanjes(perfilId));
    } catch (error) {
      console.error(error);
      this.canjes.set([]);
    }
  }

  private cargarRecompensas() {
    this.recompensaStore.listar()
      .then((r) => this.recompensas.set(r))
      .catch((error) => console.error('No se pudieron cargar las recompensas', error));
  }

  constructor() {
    this.cargarRecompensas();

    effect(() => {
      const id = this.perfil()?.id;
      if (id) this.cargarCanjes(id);
    });
  }
}