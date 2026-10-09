import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaCard } from '../pelicula-card/pelicula-card';
import { GeneroModel } from '../../generos/genero.model';
import { PeliculaStore } from '../pelicula.store';
import { ReporteStore } from '../../reportes/reportes.store';
import { PerfilModel } from '../../perfiles/perfil.model';
import { PeliculaModel } from '../pelicula.model';

@Component({
  imports: [RouterLink, PeliculaCard],
  selector: 'app-pelicula-list',
  styleUrl: './pelicula-list.css',
  templateUrl: './pelicula-list.html',
})
export class PeliculaList {

  private readonly storePeliculas = inject(PeliculaStore);
  private readonly storeReportes = inject(ReporteStore);

  private readonly topReportes = signal<{ peliculaId: number; cantidad: number }[]>([]);

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

  top3 = computed(() => {
    const peliculas = this.storePeliculas.peliculas();

    return this.topReportes()
      .map((r) => peliculas.find((p) => p.id === r.peliculaId))
      .filter((p): p is PeliculaModel => p !== undefined);
  });

  peliculaDe(id: number) {
    return this.storePeliculas.find(id);
  }

  elegirGenero(g: GeneroModel){
    if (this.generoSeleccionado()?.id === g.id) {
      this.generoSeleccionado.set(null);
    } else {
      this.generoSeleccionado.set(g);
    }
  }

  constructor() {
    this.storePeliculas.init();

    this.storeReportes
    .topPeliculas(3)
    .then((reportes) => this.topReportes.set(reportes))
    .catch((err) => console.error('Error cargando top películas', err));
  }

  /* Aca ira la logica para mostrar las peliculas mas vendidas */
};
