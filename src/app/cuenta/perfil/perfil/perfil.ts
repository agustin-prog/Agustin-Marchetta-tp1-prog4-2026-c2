import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Estrellas } from '../../../resenas/estrellas/estrellas/estrellas';
import { ResenaStore } from '../../../resenas/resena.store';
import { AuthService } from '../../../auth/auth.service';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { ResenaConPelicula } from '../../../resenas/resena.model';
import { PrecioArsPipe } from '../../../pipes/pipe-precio-ars/precio-ars-pipe';
import { FechaPipe } from '../../../pipes/pipe-fecha/fecha-pipe';
import { EdadPipe } from '../../../pipes/pipe-edad/edad-pipe';
import { EstadoPropuesta } from '../../proponer/estado-propuesta/estado-propuesta';
import { MisListasEspera } from '../../lista-espera/mis-listas-espera/mis-listas-espera';

@Component({
  imports: [RouterLink, PrecioArsPipe, FechaPipe, EdadPipe, Estrellas, EstadoPropuesta, MisListasEspera],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class CuentaPerfil {

  private readonly resenaStore = inject(ResenaStore);
  protected readonly auth = inject(AuthService);
  protected readonly perfil = inject(PerfilStore).perfil;

  protected readonly resenas = signal<ResenaConPelicula[]>([]);

  constructor() {
    effect(() => {
      const id = this.perfil()?.id;
      if (!id) return;

      this.resenaStore.porPerfil(id)
        .then((r) => this.resenas.set(r))
        .catch((error) => console.error("No se pudieron cargar tus reseñas", error));
    });
  }
}