import { Component, inject, signal } from '@angular/core';
import { NotificacionStore } from '../notificacion.store';
import { Router } from '@angular/router';
import { NotificacionModel } from '../notificacion.model';
import { FechaPipe } from '../../pipes/pipe-fecha/fecha-pipe';

@Component({
  imports: [FechaPipe],
  selector: 'app-campana',
  styleUrl: './campana.css',
  templateUrl: './campana.html',
})
export class Campana {

  protected readonly store = inject(NotificacionStore);
  private readonly router = inject(Router);

  protected readonly abierto = signal(false);

  async abrir(n: NotificacionModel) {
    this.abierto.set(false);
    if (!n.leida) await this.store.marcarLeida(n.id).catch((error) => console.error(error));
    if (n.enlace) this.router.navigateByUrl(n.enlace);
  }

  marcarTodas() {
    this.store.marcarTodasLeidas().catch((error) => console.error(error));
  }
}