import { Component, inject, signal } from "@angular/core";
import { form, FormField, FormRoot, maxLength, required, min } from "@angular/forms/signals";
import { RouterLink } from "@angular/router";
import { ProductoStore } from "../../../candy/producto.store";
import { CategoriaStore } from "../../../candy/categoria.store";
import { ImagenStore } from "../../../storage/imagen.store";
import { mensajeDeError } from "../../../shared/errores";
import { ProductoModel } from "../../../candy/candy.model";
import { PrecioArsPipe } from "../../../pipes/pipe-precio-ars/precio-ars-pipe";

@Component({
  imports: [FormField, FormRoot, RouterLink, PrecioArsPipe],
  selector: 'app-productos-form-admin',
  styleUrl: './productos-form-admin.css',
  templateUrl: './productos-form-admin.html',
})
export class ProductosFormAdmin {

  protected readonly store = inject(ProductoStore);
  protected readonly categoriaStore = inject(CategoriaStore);
  private readonly imagenStore = inject(ImagenStore);

  protected readonly editandoId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly subiendo = signal(false);
  protected readonly errorImagen = signal<string | null>(null);

  private readonly formularioVacio = { categoriaId: "", nombre: "", precio: 0, imagenUrl: "" };
  private readonly datosProducto = signal({ ...this.formularioVacio });

  protected readonly productoForm = form(this.datosProducto, (campo) => {
    required(campo.categoriaId, { message: "Elegí una categoría" });

    required(campo.nombre, { message: "El nombre es obligatorio" });

    maxLength(campo.nombre, 60, { message: "Máximo 60 caracteres" });

    min(campo.precio, 1, { message: "El precio debe ser mayor a 0" });
  },
  {
    submission: {
      action: async () => {
        this.error.set(null);
        const m = this.datosProducto();
        const datos = { categoriaId: Number(m.categoriaId), nombre: m.nombre, precio: m.precio, imagenUrl: m.imagenUrl };

        try {
          const id = this.editandoId();

          if (id === null) {
            await this.store.add(datos);
          } else {
            await this.store.update(id, datos);
          }

          this.limpiar();
        } catch (error) {
          this.error.set(mensajeDeError(error, "No se pudo guardar el producto."));
        }
      },
    },
  });

  protected nombreCategoria(id: number): string {
    return this.categoriaStore.categorias().find((c) => c.id === id)?.nombre ?? "";
  }

  protected editar(p: ProductoModel) {
    this.editandoId.set(p.id);
    this.datosProducto.set({ categoriaId: String(p.categoriaId), nombre: p.nombre, precio: p.precio, imagenUrl: p.imagenUrl });
  }

  protected limpiar() {
    this.editandoId.set(null);
    this.errorImagen.set(null);
    this.datosProducto.set({ ...this.formularioVacio });
    this.productoForm().reset();
  }

  protected async alElegirImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.subiendo.set(true);
    this.errorImagen.set(null);
    try {
      const url = await this.imagenStore.subir("productos", archivo);
      this.datosProducto.update((m) => ({ ...m, imagenUrl: url }));
    } catch (error) {
      this.errorImagen.set(mensajeDeError(error, "No se pudo subir la imagen."));
      input.value = "";
    } finally {
      this.subiendo.set(false);
    }
  }

  protected async cambiarActivo(p: ProductoModel) {
    this.error.set(null);
    try {
      await this.store.cambiarActivo(p.id, !p.activo);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  protected async eliminar(p: ProductoModel) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.error.set(null);
    try {
      await this.store.remove(p.id);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  constructor() {
    this.store.init();
    this.categoriaStore.init();
  }
}
