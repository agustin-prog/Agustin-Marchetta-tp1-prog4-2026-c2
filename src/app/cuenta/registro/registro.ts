import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cuenta-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class CuentaRegistro {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly nombre = signal('');
  protected readonly apellido = signal('');
  protected readonly fechaNacimiento = signal('');
  protected readonly tipoSangre = signal('');
  protected readonly colorOjos = signal('');
  protected readonly diasVacaciones = signal<number | null>(null);

  protected readonly errorMsg = signal<string | null>(null);
  protected readonly exito = signal(false);
  protected readonly cargando = signal(false);

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

    } catch (error) {
      this.errorMsg.set(error instanceof Error ? error.message : "No se pudo crear la cuenta");
    } finally {
      this.cargando.set(false);
    }
  }

  async conGitHub() {
    this.errorMsg.set(null);
    try {
      await this.auth.iniciarConOAuth('github');
    } catch (error) {
      this.errorMsg.set(error instanceof Error ? error.message : "No se pudo iniciar con GitHub");
    }
  }
}