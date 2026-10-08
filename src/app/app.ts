import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PerfilStore } from './perfiles/perfil.store';
import { AuthService } from './auth.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  selector: 'app-navbar',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly perfilStore = inject(PerfilStore);
  readonly menuAbierto = signal(false);

  async cerrarSesion() {
    await this.auth.cerrarSesion();
    this.menuAbierto.set(false);
  }
}