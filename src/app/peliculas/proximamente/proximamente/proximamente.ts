import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaCard } from '../../pelicula-card/pelicula-card';
import { PeliculaStore } from '../../pelicula.store';
import { FuncionStore } from '../../../funciones/funcion.store';
import { AlertaStore } from '../../../alertas/alerta.store';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { estadoPelicula, fechaLocal } from '../../pelicula-estado';

@Component({
  imports: [RouterLink, PeliculaCard],
  selector: 'app-proximamente',
  styleUrl: './proximamente.css',
  templateUrl: './proximamente.html',
})
export class Proximamente {

  private readonly storePeliculas = inject(PeliculaStore);
  private readonly storeFunciones = inject(FuncionStore);
  protected readonly storeAlertas = inject(AlertaStore);
  protected readonly perfil = inject(PerfilStore).perfil;

  protected readonly error = signal<string | null>(null);

  protected readonly peliculas = computed(() => {
    const ids = this.storeFunciones.peliculaIdsConFunciones();

    return this.storePeliculas.peliculas()
      .filter((p) => estadoPelicula(p, ids.has(p.id)) === 'proximamente')
      .sort((a, b) => fechaLocal(a.fechaEstreno!).getTime() - fechaLocal(b.fechaEstreno!).getTime());
  });

  constructor() {
    this.storePeliculas.init();
    this.storeFunciones.init();
  }

  protected async alternarAlerta(peliculaId: number) {
    this.error.set(null);

    try {
      await this.storeAlertas.alternar(peliculaId);
    } catch (error) {
      this.error.set('No se pudo actualizar la alerta.');
      console.error(error);
    }
  }
}