import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaCard } from '../pelicula-card/pelicula-card';
import { GeneroModel } from '../../generos/genero.model';
import { PeliculaStore } from '../pelicula.store';
import { ReporteStore } from '../../reportes/reportes.store';
import { PeliculaModel } from '../pelicula.model';
import { FuncionStore } from '../../funciones/funcion.store';
import { estadoPelicula } from '../pelicula-estado';
import { BuscadorPeliculas } from '../buscador-peliculas/buscador-peliculas';

const TOP_PELICULAS = 3;

@Component({
  imports: [RouterLink, PeliculaCard, BuscadorPeliculas],
  selector: 'app-pelicula-list',
  styleUrl: './pelicula-list.css',
  templateUrl: './pelicula-list.html',
})
export class PeliculaList {

  private readonly storePeliculas = inject(PeliculaStore);
  private readonly storeReportes = inject(ReporteStore);
  private readonly funcionStore = inject(FuncionStore);

  private readonly topReportes = signal<{ peliculaId: number; cantidad: number }[]>([]);
  protected readonly texto = signal('');
  generoSeleccionado = signal<GeneroModel | null>(null);

  protected readonly enCartelera = computed(() => {
    const ids = this.funcionStore.peliculaIdsConFunciones();

    return this.storePeliculas.peliculas().filter((p) => {
      const estado = estadoPelicula(p, ids.has(p.id));
      return estado === 'cartelera' || estado === 'preventa';
    });
  });

  protected readonly proximamente = computed(() => {
    const peliculas = this.storePeliculas.peliculas();
    if (!peliculas.length) return [];

    return peliculas.filter((p) => this.esPeliculaSinEstrenar(p) && !p.preventaHabilitada);
  });

  protected readonly generosDisponibles = computed(() => {
    const cartelera = this.enCartelera();
    if (!cartelera.length) return [];

    const mapa = new Map<number, GeneroModel>();

    cartelera.forEach((p) => {
      p.generos?.forEach((g) => mapa.set(g.id, g));
    });

    return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  protected readonly peliculasFiltradas = computed(() => {
    const cartelera = this.enCartelera();
    const textoBusqueda = this.texto().toLowerCase().trim();
    const genero = this.generoSeleccionado();

    if (!cartelera.length) return [];

    return cartelera.filter((p) => {
      const coincideTexto =
        textoBusqueda === '' ||
        p.nombre.toLowerCase().includes(textoBusqueda) ||
        (p.generos?.some((g) => g.nombre.toLowerCase().includes(textoBusqueda)) ?? false);

      const coincideGenero = !genero || (p.generos?.some((g) => g.id === genero.id) ?? false);

      return coincideTexto && coincideGenero;
    });
  });

  protected readonly top3 = computed(() => {
    const todasLasPeliculas = this.storePeliculas.peliculas();
    const idsConFunciones = this.funcionStore.peliculaIdsConFunciones();
    const reportes = this.topReportes();

    if (!todasLasPeliculas.length || !idsConFunciones || !reportes.length) return [];

    return reportes
      .map((r) => todasLasPeliculas.find((p) => p.id === r.peliculaId))
      .filter((p): p is PeliculaModel => p !== undefined && idsConFunciones.has(p.id));
  });

  constructor() {
    this.storePeliculas.init();
    this.funcionStore.init();

    this.storeReportes
      .topPeliculas(TOP_PELICULAS)
      .then((reportes) => this.topReportes.set(reportes))
      .catch((error) => console.error('Error cargando top películas', error));
  }
  
  private readonly ahora = Date.now();

  private esPeliculaSinEstrenar(pelicula: PeliculaModel): boolean {
    if (!pelicula.fechaEstreno) return false;

    const fechaEstrenoMs = new Date(pelicula.fechaEstreno).getTime();
    return fechaEstrenoMs > this.ahora;
  }

  peliculaDe(id: number) {
    return this.storePeliculas.find(id);
  }

  elegirGenero(g: GeneroModel) {
    if (this.generoSeleccionado()?.id === g.id) {
      this.generoSeleccionado.set(null);
    } else {
      this.generoSeleccionado.set(g);
    }
  }
}