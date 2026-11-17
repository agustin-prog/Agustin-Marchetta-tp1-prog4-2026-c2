import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VentaStore } from '../../../ventas/venta.store';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { puedeCancelar, VentaModel } from '../../../ventas/venta.model';
import { mensajeDeError } from '../../../errores';
import { descargarComprobante } from '../../../compra/comprobante';
import { FechaPipe } from '../../../pipes/pipe-fecha/fecha-pipe';
import { PrecioArsPipe } from '../../../pipes/pipe-precio-ars/precio-ars-pipe';

@Component({
  imports: [RouterLink, FechaPipe, PrecioArsPipe],
  selector: 'app-historial',
  styleUrl: './historial.css',
  templateUrl: './historial.html',
})
export class Historial {

  private readonly ventaStore = inject(VentaStore);
  private readonly perfilStore = inject(PerfilStore);
  protected readonly perfil = this.perfilStore.perfil;

  protected readonly ventas = signal<VentaModel[] | null>(null);
  protected readonly cancelando = signal<number | null>(null);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly puedeCancelar = puedeCancelar;

  protected motivoNoCancelable(v: VentaModel): string {
    if (v.utilizada) return "Ya usaste esta compra.";
    return "Solo se puede cancelar hasta 2 horas antes de la función.";
  }

  protected async cancelar(v: VentaModel) {
    const ok = confirm(
      `¿Cancelar la compra de "${v.pelicula}"?\n\nNo se devuelve dinero: el importe se convierte en crédito para tus próximas compras.`,
    );
    if (!ok) return;

    this.cancelando.set(v.id);
    this.error.set(null);
    this.mensaje.set(null);

    try {
      const credito = await this.ventaStore.cancelar(v.qr);
      this.mensaje.set(`Compra cancelada. Se acreditaron $${credito.toLocaleString("es-AR")} a tu cuenta.`);

      const id = this.perfil()?.id;
      if (id) {
        await this.cargar(id);
        this.perfilStore.cargar(id).catch(() => {});
      }
    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudo cancelar la compra."));
    } finally {
      this.cancelando.set(null);
    }
  }

  protected descargar(v: VentaModel) {
    descargarComprobante({
      qr: v.qr,
      pelicula: v.pelicula,
      sala: v.sala,
      fechaHora: v.fechaHoraInicio,
      formato: v.formato,
      idioma: v.idioma,
      butacas: v.butacas,
      candy: v.candy,
      total: v.total,
      restriccion: v.restriccion,
    }).catch((error) => {
      console.error(error);
      this.error.set("No se pudo generar el comprobante.");
    });
  }

  private async cargar(perfilId: string) {
    try {
      this.ventas.set(await this.ventaStore.listarMias(perfilId));
    } catch (error) {
      this.ventas.set([]);
      this.error.set(mensajeDeError(error, "No se pudo cargar tu historial."));
    }
  }

  constructor() {
    effect(() => {
      const id = this.perfil()?.id;
      if (id) this.cargar(id);
      else this.ventas.set(null);
    });
  }
}