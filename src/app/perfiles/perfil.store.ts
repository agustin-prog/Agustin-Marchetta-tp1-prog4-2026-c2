import { computed, Injectable, inject, signal } from '@angular/core';
import { PerfilService } from './perfil.service';
import { PerfilModel } from './perfil.model';
import { Permiso, SECCIONES } from '../auth/secciones-admin';

@Injectable({ providedIn: 'root' })
export class PerfilStore {
  private readonly service = inject(PerfilService);

  readonly perfil = signal<PerfilModel | null>(null);
  readonly loading = signal(false);
  readonly permisos = signal<string[]>([]);

  readonly secciones = computed(() => {
    const p = this.permisos();
    return SECCIONES
      .filter((s) => s.permisos.some((x) => p.includes(x)))
      .map((s) => ({ texto: s.texto, ruta: s.ruta(p) }));
  });

  tiene(permiso: Permiso): boolean {
    return this.permisos().includes(permiso);
  }

  async cargar(userId: string | null) {
    if (!userId) {
      this.perfil.set(null);
      this.permisos.set([]);
      return;
    }

    this.loading.set(true);
    try {
      const { perfil, permisos } = await this.service.cargar(userId);
      this.perfil.set(perfil);
      this.permisos.set(permisos);
      
    } finally {
      this.loading.set(false);
    }
  }
}