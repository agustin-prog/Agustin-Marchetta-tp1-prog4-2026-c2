import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { FiltroVentas, VentaAdminModel, VentaAdminRow } from './venta-admin.model';

@Injectable({ providedIn: 'root' })
export class VentaAdminService {
  private readonly db = supabase;

  async listar(f: FiltroVentas): Promise<VentaAdminModel[]> {
    let consulta = this.db
      .from("ventas")
      .select(`id, total, estado, qr_codigo, created_at, perfil_id,
            perfiles(nombre, apellido),
            entradas(ocupacion(funciones(fecha_hora_inicio, peliculas(nombre)))),
            detalle_candy(cantidad), venta_combos(cantidad)`)
      .order("created_at", { ascending: false })
      .limit(300);

    if (f.desde) consulta = consulta.gte("created_at", `${f.desde}T00:00:00-03:00`);
    if (f.hasta) consulta = consulta.lte("created_at", `${f.hasta}T23:59:59.999-03:00`);
    if (f.estado === "canceladas") consulta = consulta.eq("estado", "cancelada");
    if (f.estado === "activas") consulta = consulta.neq("estado", "cancelada");

    const { data, error } = await consulta;
    if (error) throw error;

    return (data as unknown as VentaAdminRow[]).map((r) => {
      const primera = r.entradas[0]?.ocupacion?.funciones;
      const nombre = `${r.perfiles?.nombre ?? ""} ${r.perfiles?.apellido ?? ""}`.trim();

      return {
        id: r.id,
        fecha: r.created_at,
        cliente: r.perfil_id === null ? "Anónimo" : (nombre || "Registrado"),
        pelicula: primera?.peliculas.nombre ?? "Canje de recompensa",
        funcion: primera?.fecha_hora_inicio ?? null,
        entradas: r.entradas.length,
        conCandy: r.detalle_candy.length > 0 || r.venta_combos.length > 0,
        total: Number(r.total),
        estado: r.estado ?? "confirmada",
        qr: r.qr_codigo,
      };
    });
  }
}