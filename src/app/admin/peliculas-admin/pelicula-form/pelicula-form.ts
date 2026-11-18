import { Component, computed, effect, inject, input, numberAttribute, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormField, FormRoot, form, required, min, max, minLength, maxLength } from "@angular/forms/signals";
import { PeliculaStore } from "../../../peliculas/pelicula.store";
import { PeliculaInput, RestriccionEdad } from "../../../peliculas/pelicula.model";
import { untracked } from "@angular/core/primitives/signals";
import { GeneroStore } from "../../../generos/genero.store";
import { ImagenStore } from "../../../storage/imagen.store";

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-pelicula-form',
  styleUrl: './pelicula-form.css',
  templateUrl: './pelicula-form.html',
})
export class PeliculaForm {

  private readonly store = inject(PeliculaStore);
  private readonly generoStore = inject(GeneroStore);
  private readonly router = inject(Router);
  private readonly imagenStore = inject(ImagenStore);

  private idCargado: number | undefined;

  peliculaId = input<number | undefined, unknown>(undefined, {
    transform: value => value === undefined || value === null || value === ""
      ? undefined
      : numberAttribute(value),
  });

  private readonly datosFormulario = signal<PeliculaInput>({
    nombre: "",
    sinopsis: "",
    duracionMinutos: 0,
    restriccionEdad: "ninguna",
    preventaHabilitada: false,
    generoIds: [],
    posterUrl: "",
    fechaEstreno: "",
    precioPreventa: null,
  });

  protected readonly subiendoPoster = signal(false);
  protected readonly errorPoster = signal<string | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorGuardado = signal<string | null>(null);
  protected readonly restricciones: RestriccionEdad[] = ["ninguna", "+13", "+18"];
  protected readonly generos = this.generoStore.generos;

  protected readonly idsSeleccionados = computed(() => new Set(this.datosFormulario().generoIds));

  protected readonly generosSeleccionados = computed(() =>
    this.datosFormulario().generoIds.flatMap((id) => {
      const g = this.generos().find((x) => x.id === id);
      return g ? [g] : [];
    }),
  );

  protected alternarGenero(id: number): void {
    this.datosFormulario.update((m) => ({
      ...m,
      generoIds: m.generoIds.includes(id)
        ? m.generoIds.filter((x) => x !== id)
        : [...m.generoIds, id],
    }));
    this.peliculaForm.generoIds().markAsTouched();
  }

  private mensajeError(error: unknown): string {
    if (error instanceof Error) return error.message;

    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {

      const detalle = "details" in error && typeof error.details === "string" ? error.details : "";
      const ayuda = "hint" in error && typeof error.hint === "string" ? error.hint : "";
      return [error.message, detalle, ayuda].filter(Boolean).join(" ");
    }

    return "Error desconocido.";
  }

  protected async alElegirPoster(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.subiendoPoster.set(true);
    this.errorPoster.set(null);

    try {
      const url = await this.imagenStore.subir("peliculas", archivo);
      this.datosFormulario.update((m) => ({ ...m, posterUrl: url }));

    } catch (error) {
      this.errorPoster.set(this.mensajeError(error));
      input.value = "";

    } finally {
      this.subiendoPoster.set(false);
    }
  }

  protected peliculaForm = form(this.datosFormulario, (campo) => {

    required(campo.nombre, { message: "El nombre es obligatorio" });
    minLength(campo.nombre, 2, { message: "Mínimo 2 caracteres" });
    maxLength(campo.nombre, 100, { message: "Máximo 100 caracteres" });

    required(campo.sinopsis, { message: "La sinopsis es obligatoria" });
    maxLength(campo.sinopsis, 500, { message: "Máximo 500 caracteres" });

    min(campo.duracionMinutos, 1, { message: "La duración debe ser mayor a 0" });
    max(campo.duracionMinutos, 400, { message: "La duración es demasiado larga" });

    required(campo.restriccionEdad, { message: "La restricción es obligatoria" });

    minLength(campo.generoIds, 1, { message: "Elegí al menos un género" });
    maxLength(campo.generoIds, 4, { message: "Máximo 4 géneros" });
  },
  {
    submission: {
      action: async () => {
        this.guardando.set(true);
        this.errorGuardado.set(null);

        try {
          const id = this.peliculaId();

          if (id === undefined) {
            await this.store.add(this.datosFormulario());
          } else {
            await this.store.update(id, this.datosFormulario());
          }
          this.router.navigate(["/peliculas"]);
        } catch (error) {
          this.errorGuardado.set(`No se pudo guardar la película: ${this.mensajeError(error)}`);
          console.error(error);
        } finally {
          this.guardando.set(false);
        }
      },
    },
  });

  constructor() {
    const propuesta = (history.state as { propuesta?: { titulo: string; sinopsis: string } } | null)?.propuesta;
    
    if (propuesta) {
      this.datosFormulario.update((m) => ({ ...m, nombre: propuesta.titulo, sinopsis: propuesta.sinopsis }));
    }

    this.store.init();
    this.generoStore.init();

    effect(() => {
      const id = this.peliculaId();
      if (id === undefined) return;

      const p = this.store.find(id);
      if (!p || this.idCargado === id) return;

      this.idCargado = id;

      const { id: _id, generos, ...resto } = p;
      untracked(() => this.datosFormulario.set({ ...resto, generoIds: generos.map((g) => g.id) }));
    });
  }
}