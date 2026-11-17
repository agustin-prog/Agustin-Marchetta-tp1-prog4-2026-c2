import { Component, inject, signal } from "@angular/core";
import { mensajeDeError } from "../../../errores";
import { form, FormField, FormRoot, maxLength, minLength, required } from "@angular/forms/signals";
import { RouterLink } from "@angular/router";
import { EstadoPropuesta } from "../estado-propuesta/estado-propuesta";
import { PropuestaStore } from "../../../propuesta/propuesta.store";
import { PerfilStore } from "../../../perfiles/perfil.store";

function textoError(error: unknown, defecto: string): string {
  const err = error as { 
    code?: string; 
    message?: string 
  };
  
  return err?.code === "P0001" && err.message ? err.message : mensajeDeError(error, defecto);
}

@Component({
  imports: [FormField, FormRoot, RouterLink, EstadoPropuesta],
  selector: "app-proponer-pelicula",
  styleUrl: "./proponer-pelicula.css",
  templateUrl: "./proponer-pelicula.html",
})
export class ProponerPelicula {

  private readonly store = inject(PropuestaStore);
  protected readonly perfil = inject(PerfilStore).perfil;
  protected readonly pendiente = this.store.pendiente;

  protected readonly enviando = signal(false);
  protected readonly errorEnvio = signal<string | null>(null);
  protected readonly enviada = signal(false);
  private readonly datosPropuesta = signal({ titulo: "", descripcion: "", motivo: "" });

  protected readonly propuestaForm = form(this.datosPropuesta, (campo) => {

    required(campo.titulo, { message: "El título es obligatorio" });
    minLength(campo.titulo, 2, { message: "Mínimo 2 caracteres" });
    maxLength(campo.titulo, 100, { message: "Máximo 100 caracteres" });

    required(campo.descripcion, { message: "La descripción es obligatoria" });
    minLength(campo.descripcion, 10, { message: "Mínimo 10 caracteres" });
    maxLength(campo.descripcion, 500, { message: "Máximo 500 caracteres" });

    required(campo.motivo, { message: "Contanos por qué querés verla en el cine" });
    minLength(campo.motivo, 10, { message: "Mínimo 10 caracteres" });
    maxLength(campo.motivo, 500, { message: "Máximo 500 caracteres" });
  },
  {
    submission: {
      action: async () => {

        this.enviando.set(true);
        this.errorEnvio.set(null);

        try {

          const datos = this.datosPropuesta();
          await this.store.enviar(datos.titulo, datos.descripcion, datos.motivo);

          this.datosPropuesta.set({ titulo: "", descripcion: "", motivo: "" });
          this.enviada.set(true);

        } catch (error) {
          this.errorEnvio.set(textoError(error, "No se pudo enviar la propuesta."));
        } finally {
          this.enviando.set(false);
        }
      },
    },
  });
}