import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cuenta-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class CuentaLogin {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal("");
  protected readonly password = signal("");
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly cargando = signal(false);

  async iniciarSesion() {
    this.errorMsg.set(null);
    this.cargando.set(true);

    try {
      await this.auth.iniciarSesion(this.email(), this.password());
      this.router.navigateByUrl('/peliculas');

    } catch (error) {
      this.errorMsg.set(error instanceof Error ? error.message : "No se pudo iniciar sesión");
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