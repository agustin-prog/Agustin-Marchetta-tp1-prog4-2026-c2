import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { CanjeModel, CanjeRow } from './recompensa.model';

@Injectable({ providedIn: 'root' })
export class RecompensaCanjeService {
  private readonly db = supabase;

  async canjear(recompensaId: number): Promise<string | null> {
    const { data, error } = await this.db.rpc("canjear_recompensa", { p_recompensa_id: recompensaId });
    if (error) throw error;
    
    return (data as string | null) ?? null;
  }

  async entradasGratisPendientes(perfilId: string): Promise<number> {
    const { count, error } = await this.db
      .from("canjes")
      .select("id, recompensas!inner(producto_id)", { count: "exact", head: true })
      .eq("perfil_id", perfilId)
      .is("venta_id", null)
      .is("recompensas.producto_id", null);

    if (error) throw error;

    return count ?? 0;
  }

  async misCanjes(perfilId: string): Promise<CanjeModel[]> {
    const { data, error } = await this.db
      .from("canjes")
      .select("id, created_at, venta_id, recompensas(nombre, costo_puntos, producto_id), ventas(qr_codigo, detalle_candy(validada))")
      .eq("perfil_id", perfilId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data as unknown as CanjeRow[]).map((c) => {
      const esEntrada = c.recompensas.producto_id === null;
      const retirado = !!c.ventas && c.ventas.detalle_candy.every((d) => d.validada);

      return {
        id: c.id,
        fecha: c.created_at,
        recompensa: c.recompensas.nombre,
        costoPuntos: c.recompensas.costo_puntos,
        esEntrada,
        qr: c.ventas?.qr_codigo ?? null,
        estado: esEntrada
          ? (c.venta_id === null ? "Disponible para usar al pagar" : "Usada")
          : (retirado ? "Retirado" : "Pendiente de retiro"),
      };
    });
  }
}