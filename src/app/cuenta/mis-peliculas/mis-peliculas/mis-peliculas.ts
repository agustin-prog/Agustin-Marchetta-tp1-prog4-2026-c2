import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Estrellas } from '../../../resenas/estrellas/estrellas/estrellas';
import { VentaStore } from '../../../ventas/venta.store';
import { ResenaStore } from '../../../resenas/resena.store';
import { PerfilStore } from '../../../perfiles/perfil.store';
import { PeliculaVista } from '../../../ventas/venta.model';
import { FechaPipe } from '../../../pipes/pipe-fecha/fecha-pipe';

@Component({
  imports: [RouterLink, FechaPipe, Estrellas],
  selector: 'app-mis-peliculas',
  styleUrl: './mis-peliculas.css',
  templateUrl: './mis-peliculas.html',
})
export class CuentaMisPeliculas {

  private readonly ventaStore = inject(VentaStore);
  private readonly resenaStore = inject(ResenaStore);
  protected readonly perfil = inject(PerfilStore).perfil;

  protected readonly vistas = signal<PeliculaVista[] | null>(null);
  private readonly calificaciones = signal<Map<number, number>>(new Map());

  protected estrellasDe(peliculaId: number): number | undefined {
    return this.calificaciones().get(peliculaId);
  }

  private async cargar(perfilId: string) {
    try {
      const [vistas, resenas] = await Promise.all([
        this.ventaStore.peliculasVistas(perfilId),
        this.resenaStore.porPerfil(perfilId),
      ]);

      this.calificaciones.set(new Map(resenas.map((r) => [r.peliculaId, r.estrellas])));
      this.vistas.set(vistas);
    } catch (error) {
      console.error(error);
      this.vistas.set([]);
    }
  }

  constructor() {
    effect(() => {
      const id = this.perfil()?.id;
      if (id) this.cargar(id);
    });
  }
}