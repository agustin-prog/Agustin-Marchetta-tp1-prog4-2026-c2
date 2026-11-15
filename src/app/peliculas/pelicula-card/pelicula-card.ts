import { Component, computed, input, output } from '@angular/core';
import { PeliculaModel } from '../pelicula.model';
import { enPreventa, fechaLocal, sinEstrenar } from '../pelicula-estado';
import { FechaPipe } from '../../pipes/pipe-fecha/fecha-pipe';

@Component({
  imports: [FechaPipe],
  selector: 'app-pelicula-card',
  styleUrl: './pelicula-card.css',
  templateUrl: './pelicula-card.html',
})
export class PeliculaCard {

  pelicula = input.required<PeliculaModel>();
  eliminar = output<number>();

  protected readonly preventa = computed(() => enPreventa(this.pelicula()));
  protected readonly proximo = computed(() => sinEstrenar(this.pelicula()) && !this.preventa());
  protected readonly fechaEstreno = computed(() => {
    const f = this.pelicula().fechaEstreno;
    return f ? fechaLocal(f) : null;
  });

  onEliminar() {
    this.eliminar.emit(this.pelicula().id);
  }
}