import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { ButacaOcupacionModel, EstadoButaca } from './butacaOcupacion.model';

export interface ButacaOcupacionRow {
  id: number;
  funcion_id: number;
  butaca_id: number;
  estado: EstadoButaca;
  reservada_hasta: string | null;
}

@Injectable({ providedIn: 'root' })
export class ButacaOcupacionService {
  private readonly db = supabase;

  private mapear(row: ButacaOcupacionRow): ButacaOcupacionModel {
    return {
      id: row.id,
      funcionId: row.funcion_id,
      butacaId: row.butaca_id,
      estado: row.estado,
      reservadaHasta: row.reservada_hasta ? new Date(row.reservada_hasta).getTime() : null,
    };
  }

  async load(): Promise<ButacaOcupacionModel[]> {
    const PAGINA = 1000;
    const filas: ButacaOcupacionRow[] = [];

    for (let desde = 0; ; desde += PAGINA) {
      const { data, error } = await this.db
        .from('ocupacion')
        .select('id, funcion_id, butaca_id, estado, reservada_hasta')
        .in('estado', ['reservada', 'confirmada'])
        .order('id')
        .range(desde, desde + PAGINA - 1);

      if (error) throw error;

      filas.push(...(data ?? []));
      if ((data ?? []).length < PAGINA) break;
    }

    return filas.map((row) => this.mapear(row));
  }

  async reservar(
    funcionId: number,
    butacaIds: number[],
    token: string,
  ): Promise<number | null> {
    const { data, error } = await this.db.rpc('reservar_butacas', {
      p_funcion_id: funcionId,
      p_butaca_ids: butacaIds,
      p_token: token,
    });

    if (error) {
      console.error('reservar_butacas:', error.code, error.message, error.details);
      if (error.code === '23505') {
        throw new Error('Esas butacas ya no están disponible.');
      }
      throw error;
    }

    return data as number | null;
  }
}