import { Component, inject, signal } from "@angular/core";
import { form, FormField, FormRoot, maxLength, min, required } from "@angular/forms/signals";
import { RecompensaStore } from "../../../fidelizacion/recompensa.store";
import { ProductoStore } from "../../../candy/producto.store";
import { RecompensaModel } from "../../../fidelizacion/recompensa.model";
import { mensajeDeError } from "../../../shared/errores";

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-recompensas-form-admin',
  styleUrl: './recompensas-form-admin.css',
  templateUrl: './recompensas-form-admin.html',
})
export class RecompensasFormAdmin {

  private readonly store = inject(RecompensaStore);
  protected readonly productoStore = inject(ProductoStore);

  protected readonly recompensas = signal<RecompensaModel[]>([]);
  protected readonly editandoId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);

  private readonly formularioVacio = { nombre: "", costoPuntos: 100, productoId: "" };
  private readonly datosRecompensa = signal({ ...this.formularioVacio });

  protected readonly recompensaForm = form(this.datosRecompensa, (campo) => {
    required(campo.nombre, { message: "El nombre es obligatorio" });
    maxLength(campo.nombre, 60, { message: "Máximo 60 caracteres" });

    min(campo.costoPuntos, 1, { message: "El costo debe ser mayor a 0" });
  },
  {
    submission: {
      action: async () => {
        this.error.set(null);
        const m = this.datosRecompensa();
        const datos = {
          nombre: m.nombre,
          costoPuntos: m.costoPuntos,
          productoId: m.productoId === "" ? null : Number(m.productoId),
        };

        try {
          const id = this.editandoId();

          if (id === null) {
            await this.store.crear(datos);
          } else {
            await this.store.actualizar(id, datos);
          }
          this.limpiar();
          await this.cargar();

        } catch (error) {
          this.error.set(mensajeDeError(error, "No se pudo guardar la recompensa."));
        }
      },
    },
  });

  protected editar(r: RecompensaModel) {
    this.editandoId.set(r.id);
    this.datosRecompensa.set({
      nombre: r.nombre,
      costoPuntos: r.costoPuntos,
      productoId: r.productoId === null ? "" : String(r.productoId),
    });
  }

  protected limpiar() {
    this.editandoId.set(null);
    this.datosRecompensa.set({ ...this.formularioVacio });
    this.recompensaForm().reset();
  }

  protected async cambiarActiva(r: RecompensaModel) {
    this.error.set(null);
    try {
      await this.store.cambiarActiva(r.id, !r.activa);
      await this.cargar();

    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  protected async eliminar(r: RecompensaModel) {
    if (!confirm(`¿Eliminar la recompensa "${r.nombre}"?`)) return;
    this.error.set(null);
    try {
      await this.store.eliminar(r.id);
      await this.cargar();
    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudo eliminar: si ya fue canjeada, desactivala."));
    }
  }

  private async cargar() {
    this.recompensas.set(await this.store.listarTodas());
  }

  constructor() {
    this.productoStore.init();
    this.cargar().catch((error) => console.error(error));
  }
}
