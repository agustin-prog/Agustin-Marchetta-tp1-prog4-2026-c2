import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cuenta-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class CuentaRegistro {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = signal("");
  password = signal("");
  nombre = signal("");
  apellido = signal("");
  fechaNacimiento = signal("");
  tipoSangre = signal("");
  colorOjos = signal("");
  diasVacaciones = signal<number | null>(null);

  errorMsg = signal<string | null>(null);
  exito = signal(false);
  cargando = signal(false);

  async registrarse() {
    this.errorMsg.set(null);
    this.cargando.set(true);

    try {
      await this.auth.registrarse(this.email(), this.password(), {
        nombre: this.nombre(),
        apellido: this.apellido(),
        fecha_nacimiento: this.fechaNacimiento(),
        tipo_sangre: this.tipoSangre(),
        color_ojos: this.colorOjos(),
        dias_vacaciones: this.diasVacaciones(),
      });
      this.exito.set(true);
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : "No se pudo crear la cuenta");
    } finally {
      this.cargando.set(false);
    }
  }

  async conGitHub() {
    this.errorMsg.set(null);
    try {
        await this.auth.iniciarConOAuth("github");
      } catch (e) {
          this.errorMsg.set(e instanceof Error ? e.message : "No se pudo iniciar con GitHub");
      }
  }
}
