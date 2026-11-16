import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toDataURL } from 'qrcode';
import { jsPDF } from 'jspdf';
import { VentaStore } from '../../../ventas/venta.store';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { mensajeDeError } from '../../../errores';

@Component({
  imports: [RouterLink],
  selector: 'app-confirmacion',
  styleUrl: './confirmacion.css',
  templateUrl: './confirmacion.html',
})
export class Confirmacion {

  qr = input.required<string>();

  private readonly ventaStore = inject(VentaStore);
  private readonly perfilStore = inject(PerfilStore);

  protected readonly qrImagen = signal<string | null>(null);
  protected readonly cancelada = signal(false);
  protected readonly cancelando = signal(false);
  protected readonly resultado = signal<string | null>(null);
  protected readonly errorCancelar = signal<string | null>(null);

  protected async cancelar() {
    const aviso = this.perfilStore.perfil()
      ? "El importe se convierte en crédito para tus próximas compras."
      : "Como compraste sin cuenta, no se genera crédito.";

    if (!confirm(`¿Cancelar esta compra?\n\n${aviso}`)) return;

    this.cancelando.set(true);
    this.errorCancelar.set(null);
    try {
      const credito = await this.ventaStore.cancelar(this.qr());

      this.cancelada.set(true);
      this.resultado.set(credito > 0
        ? `Compra cancelada. Se acreditaron $${credito.toLocaleString("es-AR")} a tu cuenta.`
        : "Compra cancelada.");

      const id = this.perfilStore.perfil()?.id;
      if (id) this.perfilStore.cargar(id).catch(() => {});
      
    } catch (error) {
      this.errorCancelar.set(mensajeDeError(error, "No se pudo cancelar la compra."));
    } finally {
      this.cancelando.set(false);
    }
  }

  protected descargarPdf(): void {
    const imagen = this.qrImagen();
    if (!imagen) return;

    const pdf = new jsPDF();
    pdf.setFontSize(22);
    pdf.text("Comprobante de compra", 105, 25, { align: "center" });
    pdf.addImage(imagen, "PNG", 55, 40, 100, 100);
    pdf.setFontSize(10);
    pdf.text(this.qr(), 105, 150, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Presentá este código al ingresar al cine.", 105, 165, { align: "center" });
    pdf.save("comprobante-cine.pdf");
  }

  constructor() {
    effect(() => {
      toDataURL(this.qr(), { width: 300, margin: 1 })
        .then((url) => this.qrImagen.set(url))
        .catch((error) => console.error("No se pudo generar el QR", error));
    });
  }
}