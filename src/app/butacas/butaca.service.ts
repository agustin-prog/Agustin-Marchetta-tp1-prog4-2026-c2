import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { ButacaModel } from './butaca.model';
import { generarButacas } from './butaca-generador';

export interface ButacaRow {
  id: number;
  sala_id: number;
  letra_fila: string;
  numero: number;
  sector: number;
  tipo: ButacaModel['tipo'];
}

@Injectable({ providedIn: 'root' })
export class ButacaService {
  private readonly db = supabase;

  private mapear(row: ButacaRow): ButacaModel {
    return {
      id: row.id,
      salaId: row.sala_id,
      letraFila: row.letra_fila,
      numero: row.numero,
      sector: row.sector,
      tipo: row.tipo,
    };
  }

  async load(): Promise<ButacaModel[]> {
    const { data, error } = await this.db
      .from('butacas')
      .select('*')
      .order('id');

    if (error) throw error;

    return (data ?? []).map((row: ButacaRow) => this.mapear(row));
  }

  async add(salaId: number, butacasExistentes: ButacaModel[]): Promise<void> {
    if (butacasExistentes.some((b) => b.salaId === salaId)) return;

    const filas = generarButacas(salaId).map((p) => ({
      sala_id: p.salaId,
      letra_fila: p.letraFila,
      numero: p.numero,
      sector: p.sector,
      tipo: p.tipo,
    }));

    const { error } = await this.db.from('butacas').insert(filas);

    if (error) throw error;
  }
}