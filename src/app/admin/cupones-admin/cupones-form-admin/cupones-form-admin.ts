import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, maxLength, min, required, validate } from '@angular/forms/signals';
import { CuponReglaModel } from '../../../cupones/cupon-regla.model';
import { CuponReglaStore } from '../../../cupones/cupon-regla.store';
import { ConfiguracionStore } from '../../../configuracion/configuracion.store';
import { mensajeDeError } from '../../../shared/errores';

interface ReglaFormModel {
  nombre: string;
  descuento: number;
  edadMinima: string;
  montoMinimo: string;
  vigenteDesde: string;
  vigenteHasta: string;
  soloPrimeraCompra: boolean;
}

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-cupones-form-admin',
  styleUrl: './cupones-form-admin.css',
  templateUrl: './cupones-form-admin.html',
})
export class CuponesFormAdmin {

  protected readonly store = inject(CuponReglaStore);
  private readonly config = inject(ConfiguracionStore);

  protected readonly editandoId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly errorBienvenida = signal<string | null>(null);
  protected readonly bienvenidaGuardada = signal(false);
  private readonly datosBienvenida = signal({ porcentaje: 10 });

  private readonly formularioVacio: ReglaFormModel = {
    nombre: "", 
    descuento: 10, 
    edadMinima: "", 
    montoMinimo: "",
    vigenteDesde: "", 
    vigenteHasta: "", 
    soloPrimeraCompra: false,
  };
  
  private readonly datosRegla = signal<ReglaFormModel>({ ...this.formularioVacio });

  protected readonly bienvenidaForm = form(this.datosBienvenida, (campo) => {
    min(campo.porcentaje, 1, { message: "Mínimo 1%" });
    max(campo.porcentaje, 100, { message: "Máximo 100%" });
  },
  {
    submission: {
      action: async () => {
        this.errorBienvenida.set(null);
        this.bienvenidaGuardada.set(false);

        try {

          await this.config.guardarCuponBienvenida(this.datosBienvenida().porcentaje);
          this.bienvenidaGuardada.set(true);

        } catch (error) {
          this.errorBienvenida.set(mensajeDeError(error, "No se pudo guardar el porcentaje."));
        }
      },
    },
  });

  protected readonly reglaForm = form(this.datosRegla, (campo) => {

    required(campo.nombre, { message: "El nombre es obligatorio" });
    maxLength(campo.nombre, 60, { message: "Máximo 60 caracteres" });

    min(campo.descuento, 1, { message: "Mínimo 1%" });
    max(campo.descuento, 100, { message: "Máximo 100%" });

    validate(campo.edadMinima, ({ value }) => {
      const v = value().trim();
      return v !== "" && !(Number.isInteger(Number(v)) && Number(v) >= 0)
        ? { kind: "edad", message: "Ingresá una edad válida (0 o más)" } : null;
    });

    validate(campo.montoMinimo, ({ value }) => {
      const v = value().trim();
      return v !== "" && !(Number(v) >= 0)
        ? { kind: "monto", message: "Ingresá un monto válido (0 o más)" } : null;
    });

    validate(campo.vigenteHasta, ({ value, valueOf }) =>
      value() && valueOf(campo.vigenteDesde) && value() < valueOf(campo.vigenteDesde)
        ? { kind: "rango", message: "Tiene que ser igual o posterior al inicio" } : null,
    );
  },
  {
    submission: {
      action: async () => {
        this.error.set(null);
        const m = this.datosRegla();

        const datos = {
          nombre: m.nombre,
          descuentoPorcentaje: m.descuento,
          edadMinima: m.edadMinima.trim() === "" ? null : Number(m.edadMinima),
          soloPrimeraCompra: m.soloPrimeraCompra,
          montoMinimo: m.montoMinimo.trim() === "" ? null : Number(m.montoMinimo),
          vigenteDesde: m.vigenteDesde,
          vigenteHasta: m.vigenteHasta,
        };

        try {
          const id = this.editandoId();
          if (id === null) {
            await this.store.add(datos);
          } else {
            await this.store.update(id, datos);
          }
          this.limpiar();
        } catch (error) {
          this.error.set(mensajeDeError(error, "No se pudo guardar el cupón."));
        }
      },
    },
  });

  protected condiciones(r: CuponReglaModel): string {
    const partes: string[] = [];
    if (r.edadMinima !== null) partes.push(`Edad mínima ${r.edadMinima}`);
    if (r.soloPrimeraCompra) partes.push("Solo primera compra");
    if (r.montoMinimo !== null) partes.push(`Compra mínima $${r.montoMinimo}`);
    if (r.vigenteDesde || r.vigenteHasta) {
      partes.push(`Vigencia ${r.vigenteDesde || "…"} → ${r.vigenteHasta || "…"}`);
    }
    return partes.length ? partes.join(" · ") : "Sin condiciones";
  }

  protected editar(r: CuponReglaModel) {
    this.editandoId.set(r.id);
    this.datosRegla.set({
      nombre: r.nombre,
      descuento: r.descuentoPorcentaje,
      edadMinima: r.edadMinima === null ? "" : String(r.edadMinima),
      montoMinimo: r.montoMinimo === null ? "" : String(r.montoMinimo),
      vigenteDesde: r.vigenteDesde,
      vigenteHasta: r.vigenteHasta,
      soloPrimeraCompra: r.soloPrimeraCompra,
    });
  }

  protected limpiar() {
    this.editandoId.set(null);
    this.datosRegla.set({ ...this.formularioVacio });
    this.reglaForm().reset();
  }

  protected async cambiarActivo(r: CuponReglaModel) {
    this.error.set(null);
    try {
      await this.store.cambiarActivo(r.id, !r.activo);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  protected async eliminar(r: CuponReglaModel) {
    if (!confirm(`¿Eliminar el cupón "${r.nombre}"?`)) return;
    this.error.set(null);
    try {
      await this.store.remove(r.id);
    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudo eliminar: si ya se entregó a clientes, desactivalo."));
    }
  }

  constructor() {
    this.store.init();
    this.config.cargar()
      .then(() => this.datosBienvenida.set({ porcentaje: this.config.cuponBienvenida() }))
      .catch((error) => console.error(error));
  }
}
