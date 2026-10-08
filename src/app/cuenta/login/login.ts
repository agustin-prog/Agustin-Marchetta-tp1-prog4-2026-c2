import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cuenta-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class CuentaLogin {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = signal("");
  password = signal("");
  errorMsg = signal<string | null>(null);
  cargando = signal(false);

  async iniciarSesion() {
    this.errorMsg.set(null);
    this.cargando.set(true);

    try {
      await this.auth.iniciarSesion(this.email(), this.password());
      this.router.navigateByUrl("/peliculas");
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : "No se pudo iniciar sesión");
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
