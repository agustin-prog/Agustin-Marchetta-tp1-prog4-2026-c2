import { Component, inject, signal } from "@angular/core";
import { form, FormField, FormRoot, maxLength, required } from "@angular/forms/signals";
import { CategoriaStore } from "../../../candy/categoria.store";
import { mensajeDeError } from "../../../shared/errores";
import { CategoriaModel } from "../../../candy/candy.model";

@Component({
  imports: [FormField, FormRoot],
  selector: "app-categoria-form-admin",
  styleUrl: "./categoria-form-admin.css",
  templateUrl: "./categoria-form-admin.html",
})
export class CategoriaFormAdmin {

  protected readonly store = inject(CategoriaStore);

  protected readonly editandoId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  private readonly datosCategoria = signal({ nombre: "" });

  protected readonly categoriaForm = form(this.datosCategoria, (campo) => {
  
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
            await this.store.add(this.datosCategoria().nombre);
          } else {
            await this.store.update(id, this.datosCategoria().nombre);
          }

          this.limpiar();
        } catch (error) {
          this.error.set(mensajeDeError(error, "No se pudo guardar la categoría."));
        }
      },
    },
  });

  protected editar(c: CategoriaModel) {
    this.editandoId.set(c.id);
    this.datosCategoria.set({ nombre: c.nombre });
  }

  protected limpiar() {
    this.editandoId.set(null);
    this.datosCategoria.set({ nombre: "" });
    this.categoriaForm().reset();
  }

  protected async eliminar(c: CategoriaModel) {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    this.error.set(null);
    try {
      await this.store.remove(c.id);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  constructor() {
    this.store.init();
  }
}
