import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaStore } from '../../../peliculas/pelicula.store';
import { PeliculaCardAdmin } from '../pelicula-card-admin/pelicula-card-admin';

@Component({
  imports: [PeliculaCardAdmin, RouterLink],
  selector: 'app-pelicula-list-admin',
  styleUrl: './pelicula-list-admin.css',
  templateUrl: './pelicula-list-admin.html',
})
export class PeliculaListAdmin {

  private readonly store = inject(PeliculaStore);

  protected readonly error = signal<string | null>(null);

  protected readonly peliculas = computed(() => this.store.peliculas());
}