import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculaModel } from '../pelicula.model';
import { FuncionModel } from '../../funciones/funcion.model';
import { FuncionStore } from '../../funciones/funcion.store';
import { PeliculaStore } from '../pelicula.store';

@Component({
  imports: [RouterLink, DatePipe, CurrencyPipe],
  selector: 'app-pelicula-detail',
  styleUrl: './pelicula-detail.css',
  templateUrl: './pelicula-detail.html',
})
export class PeliculaDetail {

  peliculaId = input.required({transform:numberAttribute});

  private readonly store = inject(PeliculaStore);

  private readonly storeFunciones = inject(FuncionStore);

  fechaSeleccionada = signal< Date| null>(null);

  pelicula = computed<PeliculaModel | undefined>(() => {
    return this.store.find(this.peliculaId());
  });

  fechasDisponibles = computed(() => {
      const conjuntoMilisegundos = new Set<number>();

      const funcionesPelicula = this.storeFunciones.buscarPorPelicula(this.peliculaId()) || [];
    
      // forEach para recorrer de forma limpia
      funcionesPelicula.forEach((f) => {
          const fechaNormalizada = new Date(f.fechaHoraInicio);
          fechaNormalizada.setHours(0, 0, 0, 0);
          
          // guardamos los milisegundos en el Set
          conjuntoMilisegundos.add(fechaNormalizada.getTime());
      });

    return Array.from(conjuntoMilisegundos); 
  });

  funciones = computed<FuncionModel[] | undefined>(() => {
    
    const todas = this.storeFunciones.buscarPorPelicula(this.peliculaId()) || [];

    const fecha = this.fechaSeleccionada();

    return fecha ? todas.filter((f) => f.fechaHoraInicio.getDate() === fecha.getDate()) : todas;
  });

  elegirFecha(d: number){

    const fechaObjeto = new Date(d);

    if (this.fechaSeleccionada()?.getDate() === fechaObjeto.getDate()) {
      this.fechaSeleccionada.set(null);
    } else {
      this.fechaSeleccionada.set(fechaObjeto);
    }
  }

  constructor() {
    this.store.init();
    this.storeFunciones.init();  
  }
}
