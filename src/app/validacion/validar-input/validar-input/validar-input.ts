import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from "@angular/core";
import { form, FormField, FormRoot, required } from "@angular/forms/signals";
import { ValidacionStore } from "../../validacion.store";
import { Router } from "@angular/router";
import QrScanner from "qr-scanner";

@Component({
  imports: [FormField, FormRoot],
  selector: "app-validar-input",
  styleUrl: "./validar-input.css",
  templateUrl: "./validar-input.html",
})
export class ValidarInput {

  private readonly store = inject(ValidacionStore);
  private readonly router = inject(Router);

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>("video");

  protected readonly escaneando = signal(false);
  private readonly datosCodigo = signal({ codigo: "" });
  protected readonly error = signal<string | null>(null);

  private scanner?: QrScanner;

  protected readonly validarForm = form(this.datosCodigo, (campo) => {
    required(campo.codigo, { message: "Ingresá el código" });
  },
  {
    submission: {
      action: async () => { await this.buscarYNavegar(this.datosCodigo().codigo); },
    },
  });

  protected async iniciarCamara() {
    this.error.set(null);
    try {
      this.scanner ??= new QrScanner(
        this.video().nativeElement,
        (resultado) => this.alLeer(resultado.data),
        { returnDetailedScanResult: true, highlightScanRegion: true },
      );

      await this.scanner.start();
      this.escaneando.set(true);
    } catch {
      this.error.set("No se pudo acceder a la cámara. Revisá el permiso o ingresá el código a mano.");
    }
  }

  protected detenerCamara() {
    this.scanner?.stop();
    this.escaneando.set(false);
  }

  private async alLeer(codigo: string) {
    if (!this.escaneando()) return;
    this.detenerCamara();
    await this.buscarYNavegar(codigo);
  }

  private async buscarYNavegar(codigo: string) {
    this.error.set(null);
    try {
      const venta = await this.store.buscarCompra(codigo.trim());
      
      if (!venta) {
        this.error.set("Ese código no existe.");
      } else if (venta.consumida) {
        this.error.set("Este código ya fue utilizado: todas sus prestaciones fueron consumidas.");
      } else {
        this.router.navigate(["/empleado/validar", venta.qr]);
      }

    } catch (error) {
      this.error.set("No se pudo buscar el código.");
      console.error(error);
    }
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.scanner?.destroy());
  }
}