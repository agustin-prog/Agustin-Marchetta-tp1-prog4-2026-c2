import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

export interface ButacaSalaModel {
  id: number;
  fila: string;
  numero: number;
  sector: number;
  tipo: string;
  salto: boolean;          
}

@Injectable({ providedIn: "root" })
export class SalaButacasService {
  private readonly db = supabase;

  async butacasDe(salaId: number): Promise<ButacaSalaModel[]> {
    const { data, error } = await this.db
      .from("butacas")
      .select("id, letra_fila, numero, sector, tipo")
      .eq("sala_id", salaId)
      .order("letra_fila")
      .order("sector")
      .order("numero");

    if (error) throw error;

    type Fila = { id: number; letra_fila: string; numero: number; sector: number; tipo: string };
    return (data as Fila[]).map((b, i, todas) => ({
      id: b.id,
      fila: b.letra_fila,
      numero: b.numero,
      sector: b.sector,
      tipo: b.tipo,
      salto: i > 0 && todas[i - 1].letra_fila === b.letra_fila && todas[i - 1].sector !== b.sector,
    }));
  }

  async cambiarTipoButaca(id: number, tipo: string): Promise<void> {
    const { error } = await this.db
      .from("butacas")
      .update({ tipo })
      .eq("id", id);

    if (error) throw error;
  }
}