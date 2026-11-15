import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PerfilStore } from './perfiles/perfil.store';
import { AuthService } from './auth/auth.service';
import { Campana } from './notificaciones/campana/campana';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Campana],
  selector: 'app-navbar',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly perfilStore = inject(PerfilStore);

  readonly menuAbierto = signal(false);
  readonly menuMobileAbierto = signal(false);

  toggleMenu() {
    this.menuAbierto.update((v) => !v);
  }

  toggleMenuMobile() {
    this.menuMobileAbierto.update((v) => !v);
  }

  async cerrarSesion() {
    await this.auth.cerrarSesion();
    this.menuAbierto.set(false);
    this.menuMobileAbierto.set(false);
  }
}