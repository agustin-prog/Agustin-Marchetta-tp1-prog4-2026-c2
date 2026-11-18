import { Component, computed, inject, input, output } from '@angular/core';
import { PeliculaModel } from '../../../peliculas/pelicula.model';
import { RouterLink } from '@angular/router';
import { PeliculaStore } from '../../../peliculas/pelicula.store';
import { mensajeDeError } from '../../../shared/errores';

@Component({
  imports: [RouterLink],
  selector: 'app-pelicula-card-admin',
  styleUrl: './pelicula-card-admin.css',
  templateUrl: './pelicula-card-admin.html',
})
export class PeliculaCardAdmin {

  onBorrarError = output<string | null>();

  private readonly store = inject(PeliculaStore);

  pelicula = input.required<PeliculaModel>();

  protected readonly nombre = computed(() => this.pelicula().nombre);
  protected readonly poster = computed(() => this.pelicula().posterUrl ?? 'https://placehold.co/300x450?text=Poster');

  protected async borrarPelicula(id: number) {
    if (!confirm(`¿Eliminar la película "${this.nombre()}"?`)) return;
    this.onBorrarError.emit(null);

    try {
      await this.store.remove(id);
    } catch (error) {
      this.onBorrarError.emit(mensajeDeError(error));
    }
  }
}
