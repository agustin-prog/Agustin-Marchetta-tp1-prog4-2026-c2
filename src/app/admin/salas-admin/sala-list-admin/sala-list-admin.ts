import { Component, inject, signal } from "@angular/core";
import { form, FormField, FormRoot, maxLength, required } from "@angular/forms/signals";
import { SalaStore } from "../../../salas/sala.store";
import { mensajeDeError } from "../../../shared/errores";
import { SalaModel } from "../../../salas/sala.model";

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-sala-list-admin',
  styleUrl: './sala-list-admin.css',
  templateUrl: './sala-list-admin.html',
})
export class SalaListAdmin {

  protected readonly store = inject(SalaStore);

  protected readonly editandoId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  private readonly datosSala = signal({ nombre: "" });

  protected readonly salaForm = form(this.datosSala, (campo) => {
    required(campo.nombre, { message: "El nombre es obligatorio" });
    maxLength(campo.nombre, 40, { message: "Máximo 40 caracteres" });
  },
  {
    submission: {
      action: async () => {
        this.error.set(null);

        try {
          const id = this.editandoId();

          if (id === null) {
            await this.store.crear(this.datosSala().nombre);
          } else {
            await this.store.renombrar(id, this.datosSala().nombre);
          }
          this.limpiar();
        } catch (error) {
          this.error.set(mensajeDeError(error, "No se pudo guardar la sala."));
        }
      },
    },
  });

  protected editar(s: SalaModel) {
    this.editandoId.set(s.id);
    this.datosSala.set({ nombre: s.nombreSala });
  }

  protected limpiar() {
    this.editandoId.set(null);
    this.datosSala.set({ nombre: "" });
    this.salaForm().reset();
  }

  protected async cambiarActiva(s: SalaModel) {
    this.error.set(null);

    try {
      await this.store.cambiarActiva(s.id, !s.activa);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  protected async eliminar(s: SalaModel) {
    if (!confirm(`¿Eliminar "${s.nombreSala}" con todas sus butacas?`)) return;
    this.error.set(null);
    try {
      await this.store.eliminar(s.id);
    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudo eliminar la sala."));
    }
  }

  constructor() {
    this.store.init();
  }
}
