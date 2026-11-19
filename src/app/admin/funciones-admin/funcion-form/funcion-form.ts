import { Component, computed, inject, input, numberAttribute, signal } from "@angular/core";
import { form, FormField, FormRoot, required, min, validate, max } from "@angular/forms/signals";
import { Router, RouterLink } from "@angular/router";
import { Formato, Idioma } from "../../../funciones/funcion.model";
import { FuncionStore } from "../../../funciones/funcion.store";
import { PeliculaStore } from "../../../peliculas/pelicula.store";
import { SalaStore } from "../../../salas/sala.store";
import { APERTURA, CIERRE, formatoDia, GeneradorInput, generarFunciones, LIMPIEZA_MIN } from "../funcion-horarios";
import { SalaOcupacion } from "../../../salas/sala.model";
import { FechaPipe } from "../../../pipes/pipe-fecha/fecha-pipe";
import { SelectorFecha } from "../../../shared/selector-fecha/selector-fecha";

interface FuncionFormModel {
  fechaDesde: string;
  fechaHasta: string;
  cantidad: number;
  formato: Formato;
  idioma: Idioma;
  precio: number;
}

const MAX_FUNCIONES_DIA = 8;

@Component({
  imports: [FormField, FormRoot, RouterLink, FechaPipe, SelectorFecha],
  selector: 'app-funcion-form',
  styleUrl: './funcion-form.css',
  templateUrl: './funcion-form.html',
})
export class FuncionForm {

  peliculaId = input.required({ transform: numberAttribute });

  private readonly store = inject(FuncionStore);
  private readonly peliculaStore = inject(PeliculaStore);
  private readonly salaStore = inject(SalaStore);
  private readonly router = inject(Router);

  protected readonly apertura = APERTURA;
  protected readonly cierre = CIERRE;
  protected readonly limpiezaMin = LIMPIEZA_MIN;
  protected readonly maxFunciones = MAX_FUNCIONES_DIA;
  protected readonly formatos: Formato[] = ["2D", "3D", "4D", "5D"];
  protected readonly idiomas: Idioma[] = ["castellano", "subtitulada"];
  private readonly hoy = formatoDia(new Date());

  private readonly datosFormulario = signal<FuncionFormModel>({
    fechaDesde: "",
    fechaHasta: "",
    cantidad: 3,
    formato: "2D",
    idioma: "castellano",
    precio: 0,
  });

  protected readonly horarios = signal<string[]>(["15:00", "18:00", "21:00", "", "", "", "", ""]);
  protected readonly guardando = signal(false);
  protected errorGuardado = signal<string | null>(null);

  protected readonly pelicula = computed(() => this.peliculaStore.find(this.peliculaId()));

  private readonly cantidadValidaPorDia = computed(() => {
    const n = Math.floor(Number(this.datosFormulario().cantidad) || 0);
    return Math.max(0, Math.min(MAX_FUNCIONES_DIA, n));
  });

  protected readonly indices = computed(() => Array.from({ length: this.cantidadValidaPorDia() }, (_, i) => i));

  private readonly horariosSeleccionados = computed(() => this.horarios().slice(0, this.cantidadValidaPorDia()));

  protected readonly errorHorarios = computed<string | null>(() => {
    const hs = this.horariosSeleccionados();
    if (hs.length === 0) return "Indicá cuántas funciones por día querés";

    if (hs.some((h) => !h)) return "Completá todos los horarios";

    if (hs.some((h) => h < APERTURA)) return `El cine abre a las ${APERTURA}`;

    if (hs.some((h) => h > CIERRE)) return `El cine cierra a las ${CIERRE}`;

    if (new Set(hs).size !== hs.length) return "Hay horarios repetidos";
    return null;
  });

  protected setHorario(indice: number, valor: string) {
    this.horarios.update((hs) => hs.map((h, i) => (i === indice ? valor : h)));
  }

  protected setFecha(campo: "fechaDesde" | "fechaHasta", valor: string) {
    this.datosFormulario.update((m) => ({ ...m, [campo]: valor }));
    this.funcionForm[campo]().markAsTouched();
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

  private readonly ocupacionesSala = computed<SalaOcupacion[]>(() =>
    this.store.funciones().flatMap((f) => {
      const dur = this.peliculaStore.find(f.peliculaId)?.duracionMinutos;

      if (dur === undefined) return [];

      const inicio = new Date(f.fechaHoraInicio).getTime();
      return [{ salaId: f.salaId, inicio, fin: inicio + (dur + LIMPIEZA_MIN) * 60_000 }];
    }),
  );

  private readonly parametrosGenerador = computed<GeneradorInput | null>(() => {
    const m = this.datosFormulario();
    const p = this.pelicula();

    if (!p || !m.fechaDesde || !m.fechaHasta || m.fechaHasta < m.fechaDesde) return null;
    if (this.errorHorarios() !== null) return null;

    return {
      peliculaId: p.id,
      duracionMin: p.duracionMinutos,
      fechaDesde: m.fechaDesde,
      fechaHasta: m.fechaHasta,
      horarios: this.horariosSeleccionados(),
      salaIds: this.salaStore.salas().filter((s) => s.activa).map((s) => s.id),
      ocupadas: this.ocupacionesSala(),
      formato: m.formato,
      idioma: m.idioma,
      precio: m.precio,
    };
  });

  private readonly resultadoGenerador = computed(() => {
    const p = this.parametrosGenerador();
    return p ? generarFunciones(p) : null;
  });

  protected readonly previa = computed(() => this.resultadoGenerador()?.funciones ?? []);

  protected readonly diasIncompletos = computed(() =>
    (this.resultadoGenerador()?.dias ?? []).filter((d) => d.creadas < d.pedidas),
  );

  protected nombreSala(id: number): string {
    return this.salaStore.find(id)?.nombreSala ?? `Sala ${id}`;
  }

  protected funcionForm = form(this.datosFormulario, (campo) => {

    required(campo.fechaDesde, { message: "Elegí el primer día" });
    required(campo.fechaHasta, { message: "Elegí el último día" });

    min(campo.cantidad, 1, { message: "Al menos 1 función por día" });
    max(campo.cantidad, MAX_FUNCIONES_DIA, { message: `Máximo ${MAX_FUNCIONES_DIA} funciones por día` });

    min(campo.precio, 1, { message: "El precio debe ser mayor a 0" });

    validate(campo.fechaDesde, ({ value }) =>
      value() && value() < this.hoy
        ? { kind: "pasado", message: "No puede ser un día pasado" }
        : null,
    );

    validate(campo.fechaHasta, ({ value, valueOf }) =>
      value() && value() < valueOf(campo.fechaDesde)
        ? { kind: "rango", message: "Tiene que ser igual o posterior al primer día" }
        : null,
    );
  },
  {
    submission: {
      action: async () => {
        const funciones = this.previa();

        if (this.errorHorarios() !== null) {
          this.errorGuardado.set(this.errorHorarios());
          return;
        }

        if (funciones.length === 0) {
          this.errorGuardado.set("Con ese rango y esos horarios no entra ninguna función.");
          return;
        }

        const incompletos = this.diasIncompletos();
        if (incompletos.length > 0 &&
            !confirm(`Hay ${incompletos.length} día(s) con horarios que no se pueden agendar. ¿Crear igual las ${funciones.length} funciones que sí entran?`)) {
          return;
        }

        this.guardando.set(true);
        this.errorGuardado.set(null);

        try {
          await this.store.addMany(funciones);
          this.router.navigate(["/admin/funciones", this.peliculaId()]);
        } catch (e) {
          this.errorGuardado.set(`No se pudieron guardar las funciones: ${this.mensajeError(e)}`);
          console.error(e);
        } finally {
          this.guardando.set(false);
        }
      },
    },
  });

  constructor() {
    this.store.init();
    this.peliculaStore.init();
    this.salaStore.init();
  }
}