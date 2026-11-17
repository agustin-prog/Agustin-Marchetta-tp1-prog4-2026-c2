import { Injectable, inject } from '@angular/core';
import { ResenaService } from './resena.service';
import { ResenaConPelicula, ResenaModel } from './resena.model';

@Injectable({ providedIn: 'root' })
export class ResenaStore {
  private readonly service = inject(ResenaService);

  porPelicula(peliculaId: number): Promise<ResenaModel[]> {
    return this.service.porPelicula(peliculaId);
  }

  guardar(peliculaId: number, perfilId: string, estrellas: number, comentario: string): Promise<void> {
    return this.service.guardar(peliculaId, perfilId, estrellas, comentario);
  }

  porPerfil(perfilId: string): Promise<ResenaConPelicula[]> {
    return this.service.porPerfil(perfilId);
  }
}