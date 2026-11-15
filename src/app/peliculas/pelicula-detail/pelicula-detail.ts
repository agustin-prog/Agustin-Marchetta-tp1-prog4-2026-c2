import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaModel } from '../pelicula.model';
import { FuncionModel } from '../../funciones/funcion.model';
import { FuncionStore } from '../../funciones/funcion.store';
import { PeliculaStore } from '../pelicula.store';
import { PerfilStore } from '../../perfiles/perfil.store';
import { ResenaStore } from '../../resenas/resena.store';
import { ResenaModel } from '../../resenas/resena.model';
import { enPreventa, estadoPelicula, fechaLocal } from '../pelicula-estado';
import { Estrellas } from '../../resenas/estrellas/estrellas/estrellas';
import { FechaPipe } from '../../pipes/pipe-fecha/fecha-pipe';
import { PrecioArsPipe } from '../../pipes/pipe-precio-ars/precio-ars-pipe';
import { DuracionPipe } from '../../pipes/pipe-duracion/duracion-pipe';

@Component({
  imports: [RouterLink, FechaPipe, DatePipe, DuracionPipe, DecimalPipe, PrecioArsPipe, Estrellas],
  selector: 'app-pelicula-detail',
  styleUrl: './pelicula-detail.css',
  templateUrl: './pelicula-detail.html',
})
export class PeliculaDetail {

  peliculaId = input.required({ transform: numberAttribute });

  private readonly store = inject(PeliculaStore);
  private readonly storeFunciones = inject(FuncionStore);
  private readonly storeResenas = inject(ResenaStore);
  protected readonly perfil = inject(PerfilStore).perfil;

  fechaSeleccionada = signal<number | null>(null);
  protected readonly resenas = signal<ResenaModel[]>([]);
  protected readonly estrellasNueva = signal(0);
  protected readonly comentarioNuevo = signal('');
  protected readonly guardando = signal(false);
  protected readonly errorResena = signal<string | null>(null);

  pelicula = computed<PeliculaModel | undefined>(() => this.store.find(this.peliculaId()));

  protected readonly preventa = computed(() => {
    const p = this.pelicula();
    return !!p && enPreventa(p);
  });

  protected readonly estado = computed(() => {
    const p = this.pelicula();
    return p ? estadoPelicula(p, this.fechasDisponibles().length > 0) : 'fuera';
  });

  protected readonly fechaEstreno = computed(() => {
    const f = this.pelicula()?.fechaEstreno;
    return f ? fechaLocal(f) : null;
  });

  fechasDisponibles = computed(() => {
    const ahora = Date.now();
    const conjuntoMilisegundos = new Set<number>();
    const funcionesPelicula = this.storeFunciones.buscarPorPelicula(this.peliculaId()) || [];
    const futuras = funcionesPelicula.filter((f) => new Date(f.fechaHoraInicio).getTime() > ahora);

    futuras.forEach((f) => {
      const d = new Date(f.fechaHoraInicio);
      conjuntoMilisegundos.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
    });

    return Array.from(conjuntoMilisegundos).sort((a, b) => a - b);
  });

  funciones = computed<FuncionModel[] | undefined>(() => {
    const ahora = Date.now();
    const todas = this.storeFunciones.funciones() || [];
    const seleccionado = this.fechaSeleccionada();

    const futuras = todas.filter(
      (f) => f.peliculaId === this.peliculaId() && new Date(f.fechaHoraInicio).getTime() > ahora,
    );

    if (seleccionado) {
      const buscada = new Date(seleccionado);
      return futuras.filter((f) => this.mismoDia(new Date(f.fechaHoraInicio), buscada));
    }
    return futuras;
  });

  protected readonly promedio = computed(() => {
    const lista = this.resenas();
    return lista.length ? lista.reduce((suma, r) => suma + r.estrellas, 0) / lista.length : 0;
  });
  
  protected readonly miResena = computed(() =>
    this.resenas().find((r) => r.perfilId === this.perfil()?.id),
);

constructor() {
  this.store.init();
  this.storeFunciones.init();

  effect(() => { this.cargarResenas(this.peliculaId()); });

  effect(() => {
    const mia = this.miResena();
    if (mia) {
      this.estrellasNueva.set(mia.estrellas);
      this.comentarioNuevo.set(mia.comentario);
    }
  });
}

elegirFecha(timestamp: number) {
  this.fechaSeleccionada.set(this.fechaSeleccionada() === timestamp ? null : timestamp);
}

esHoy(timestamp: number): boolean {
  return this.mismoDia(new Date(), new Date(timestamp));
  }

  esManana(timestamp: number): boolean {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return this.mismoDia(manana, new Date(timestamp));
  }

  protected async guardarResena() {
    const perfil = this.perfil();
    if (!perfil) return;

    if (this.estrellasNueva() < 1) {
      this.errorResena.set('Elegí de 1 a 5 estrellas.');
      return;
    }

    this.guardando.set(true);
    this.errorResena.set(null);
    try {
      await this.storeResenas.guardar(this.peliculaId(), perfil.id, this.estrellasNueva(), this.comentarioNuevo());

      await this.cargarResenas(this.peliculaId());

    } catch (error) {
      this.errorResena.set('No se pudo guardar tu reseña.');
      console.error(error);
      
    } finally {
      this.guardando.set(false);
    }
  }


  private mismoDia(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private async cargarResenas(peliculaId: number) {
    try {
      this.resenas.set(await this.storeResenas.porPelicula(peliculaId));
    } catch (error) {
      console.error('Error cargando reseñas', error);
    }
  }
}