import { Component, input, output } from '@angular/core';
import { PeliculaModel } from '../pelicula.model';

@Component({
  imports: [],
  selector: 'app-pelicula-card',
  styleUrl: './pelicula-card.css',
  templateUrl: './pelicula-card.html',
})
export class PeliculaCard {

  /* input.required => el padre SI o SI le tiene que pasar una pelicula */
  pelicula = input.required<PeliculaModel>();

  /* output => le avisa al padre que tocaron eliminar */
  eliminar = output<number>();

  onEliminar() {
    this.eliminar.emit(this.pelicula().id);
  }
}
