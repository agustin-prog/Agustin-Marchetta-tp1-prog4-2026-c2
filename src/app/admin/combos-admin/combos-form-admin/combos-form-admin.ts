import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, min, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ComboStore } from '../../../candy/combo.store';
import { ProductoStore } from '../../../candy/producto.store';
import { ImagenStore } from '../../../storage/imagen.store';
import { ComboInput, ComboModel } from '../../../candy/candy.model';
import { mensajeDeError } from '../../../shared/errores';
import { PrecioArsPipe } from '../../../pipes/pipe-precio-ars/precio-ars-pipe';

@Component({
  imports: [FormField, FormRoot, RouterLink, PrecioArsPipe],
  selector: 'app-combos-form-admin',
  styleUrl: './combos-form-admin.css',
  templateUrl: './combos-form-admin.html',
})
export class CombosFormAdmin {

  protected readonly store = inject(ComboStore);
  protected readonly productoStore = inject(ProductoStore);
  private readonly imagenStore = inject(ImagenStore);

  protected readonly editandoId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly subiendo = signal(false);
  protected readonly errorImagen = signal<string | null>(null);

  protected readonly itemProducto = signal("");
  protected readonly itemCantidad = signal(1);

  private readonly formularioVacio: ComboInput = { nombre: "", precio: 0, imagenUrl: "", items: [] };
  private readonly datosCombo = signal<ComboInput>({ ...this.formularioVacio });

  protected readonly comboForm = form(this.datosCombo, (campo) => {

    required(campo.nombre, { message: "El nombre es obligatorio" });
    maxLength(campo.nombre, 60, { message: "Máximo 60 caracteres" });
    min(campo.precio, 1, { message: "El precio debe ser mayor a 0" });
    minLength(campo.items, 1, { message: "Agregá al menos un producto al combo" });

  },
  {
    submission: {
      action: async () => {
        this.error.set(null);
        try {
          const id = this.editandoId();

          if (id === null) {
            await this.store.add(this.datosCombo());
          } else {
            await this.store.update(id, this.datosCombo());
          }

          this.limpiar();
        } catch (error) {
          this.error.set(mensajeDeError(error, "No se pudo guardar el combo."));
        }
      },
    },
  });

  protected readonly itemsDetallados = computed(() =>
    this.datosCombo().items.map((i) => {
      const p = this.productoStore.productos().find((x) => x.id === i.productoId);
      return { ...i, nombre: p?.nombre ?? "(producto eliminado)", precio: p?.precio ?? 0 };
    }),
  );

  protected readonly valorSeparado = computed(() =>
    this.itemsDetallados().reduce((suma, i) => suma + i.precio * i.cantidad, 0),
  );

  protected nombreProducto(id: number): string {
    return this.productoStore.productos().find((p) => p.id === id)?.nombre ?? "?";
  }

  protected agregarItem() {
    const productoId = Number(this.itemProducto());
    const cantidad = this.itemCantidad();
    if (!productoId || cantidad < 1) return;

    this.datosCombo.update((m) => {
      const existe = m.items.some((i) => i.productoId === productoId);
      const items = existe
        ? m.items.map((i) => (i.productoId === productoId ? { ...i, cantidad: i.cantidad + cantidad } : i))
        : [...m.items, { productoId, cantidad }];
      return { ...m, items };
    });

    this.comboForm.items().markAsTouched();
    this.itemProducto.set("");
    this.itemCantidad.set(1);
  }

  protected quitarItem(productoId: number) {
    this.datosCombo.update((m) => ({ ...m, items: m.items.filter((i) => i.productoId !== productoId) }));
  }

  protected editar(c: ComboModel) {
    this.editandoId.set(c.id);
    this.datosCombo.set({ nombre: c.nombre, precio: c.precio, imagenUrl: c.imagenUrl, items: c.items.map((i) => ({ ...i })) });
  }

  protected limpiar() {
    this.editandoId.set(null);
    this.errorImagen.set(null);
    this.itemProducto.set("");
    this.itemCantidad.set(1);
    this.datosCombo.set({ ...this.formularioVacio, items: [] });
    this.comboForm().reset();
  }

  protected async alElegirImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.subiendo.set(true);
    this.errorImagen.set(null);
    try {
      const url = await this.imagenStore.subir("combos", archivo);
      this.datosCombo.update((m) => ({ ...m, imagenUrl: url }));
    } catch (error) {
      this.errorImagen.set(mensajeDeError(error, "No se pudo subir la imagen."));
      input.value = "";
    } finally {
      this.subiendo.set(false);
    }
  }

  protected async cambiarActivo(p: ComboModel) {
    this.error.set(null);
    try {
      await this.store.cambiarActivo(p.id, !p.activo);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  protected async eliminar(c: ComboModel) {
    if (!confirm(`¿Eliminar el combo "${c.nombre}"?`)) return;
    this.error.set(null);
    try {
      await this.store.remove(c.id);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  constructor() {
    this.store.init();
    this.productoStore.init();
  }
}
