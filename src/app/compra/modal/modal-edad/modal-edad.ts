import { Component, input, output, signal } from "@angular/core";
import { FormField, FormRoot, form, required, validate } from "@angular/forms/signals";
import { calcularEdad, hoyIso } from "../../../peliculas/pelicula-edad";

@Component({
  imports: [FormField, FormRoot],
  selector: "app-modal-edad",
  standalone: true,
  styleUrl: "./modal-edad.css",
  templateUrl: "./modal-edad.html",
  host: { "(document:keydown.escape)": "cancelar.emit()" },
})
export class ModalEdad {

  edadMinima = input.required<number>();
  peliculaNombre = input.required<string>();

  confirmar = output<string>();
  cancelar = output<void>();

  private readonly hoy = hoyIso();
  private readonly datosEdad = signal({ fechaNacimiento: "" });

  protected readonly edadForm = form(this.datosEdad, (campo) => {
    required(campo.fechaNacimiento, { message: "Indicá tu fecha de nacimiento" });

    validate(campo.fechaNacimiento, ({ value }) => {
      const fecha = value();

      if (!fecha) return null;

      if (fecha > this.hoy) {
        return { kind: "futura", message: "La fecha no puede ser futura" };
      }

      if (calcularEdad(fecha) < this.edadMinima()) {
        return { kind: "edad", message: `Tenés que tener al menos ${this.edadMinima()} años para comprar esta entrada` };
      }

      return null;
    });
  },
  {
    submission: {
      action: async () => { this.confirmar.emit(this.datosEdad().fechaNacimiento); },
    },
  });
}