import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaCard } from '../pelicula-card/pelicula-card';
import { GeneroModel } from '../../generos/genero.model';
import { PeliculaStore } from '../pelicula.store';
import { ButacaStore } from '../../butacas/butaca.store';

@Component({
  imports: [RouterLink, PeliculaCard],
  selector: 'app-pelicula-list',
  styleUrl: './pelicula-list.css',
  templateUrl: './pelicula-list.html',
})
export class PeliculaList {

  private readonly storePeliculas = inject(PeliculaStore);

  /* dos signals de estado de UI: texto busqueda y géneros elegidos */
  texto = signal("");
  generoSeleccionado = signal<GeneroModel | null>(null);

  // computed: se recalcula solo cada vez que cambian peliculas(), texto() o generoSeleccionado()
  generosDisponibles = computed(() => {
    const mapa = new Map<number, GeneroModel>();
    this.storePeliculas.peliculas().forEach((p) => {
      p.generos.forEach((g) => mapa.set(g.id, g));
    })

    return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  peliculasFiltradas = computed(() => {
    const q = this.texto().toLowerCase().trim();
    const genero = this.generoSeleccionado();

    return this.storePeliculas.peliculas().filter((p) => {
      const coincideTexto =
        q === "" ||
        p.nombre.toLowerCase().includes(q) ||
        p.generos.some((g) => g.nombre.toLowerCase().includes(q));
      
      const coincideGenero = !genero || p.generos.some((g) => g.id === genero.id);

      return coincideTexto && coincideGenero;
    });
  });

  elegirGenero(g: GeneroModel){
    if (this.generoSeleccionado()?.id === g.id) {
      this.generoSeleccionado.set(null);
    } else {
      this.generoSeleccionado.set(g);
    }
  }

  constructor() {
    this.storePeliculas.init();
  }

  /* Aca ira la logica para mostrar las peliculas mas vendidas */
};
