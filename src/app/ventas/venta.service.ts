import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { PeliculaVista, VentaModel, VentaRow } from './venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly db = supabase;

  async listarMias(perfilId: string): Promise<VentaModel[]> {
    const { data, error } = await this.db
      .from("ventas")
      .select(`
        id, qr_codigo, estado, total, created_at,
        entradas(valida, ocupacion(butacas(letra_fila, numero),
          funciones(fecha_hora_inicio, formato, idioma,
            peliculas(nombre, poster_url, restriccion_edad), salas(nombre)))),
        detalle_candy(cantidad, validada, productos(nombre)),
        venta_combos(cantidad, validada, combos(nombre))
      `)
      .eq("perfil_id", perfilId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as unknown as VentaRow[]).map((r) => this.mapear(r));
  }

  async cancelar(qr: string): Promise<number> {
    const { data, error } = await this.db.rpc("cancelar_compra", { p_qr: qr });
    if (error) throw error;
    return Number(data);
  }

  async peliculasVistas(perfilId: string): Promise<PeliculaVista[]> {
    const { data, error } = await this.db
      .from("entradas")
      .select("ocupacion(funcion_id, funciones(fecha_hora_inicio, peliculas(id, nombre, poster_url))), ventas!inner(perfil_id)")
      .eq("valida", true)
      .eq("ventas.perfil_id", perfilId);

    if (error) throw error;

    type Fila = {
      ocupacion: {
        funcion_id: number;
        funciones: { fecha_hora_inicio: string; peliculas: { id: number; nombre: string; poster_url: string | null } };
      };
    };

    const porFuncion = new Map<number, PeliculaVista>();
    for (const fila of data as unknown as Fila[]) {
      const o = fila.ocupacion;
      if (!porFuncion.has(o.funcion_id)) {
        porFuncion.set(o.funcion_id, {
          funcionId: o.funcion_id,
          peliculaId: o.funciones.peliculas.id,
          nombre: o.funciones.peliculas.nombre,
          posterUrl: o.funciones.peliculas.poster_url ?? "",
          fecha: o.funciones.fecha_hora_inicio,
        });
      }
    }

    return [...porFuncion.values()].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
  }

  private mapear(r: VentaRow): VentaModel {
    const funcion = r.entradas[0]?.ocupacion.funciones;
    return {
      id: r.id,
      qr: r.qr_codigo,
      estado: r.estado === "cancelada" ? "cancelada" : "activa",
      total: Number(r.total),
      creadaEn: r.created_at,
      pelicula: funcion?.peliculas.nombre ?? "",
      posterUrl: funcion?.peliculas.poster_url ?? "",
      restriccion: funcion?.peliculas.restriccion_edad ?? "ninguna",
      sala: funcion?.salas.nombre ?? "",
      formato: funcion?.formato ?? "",
      idioma: funcion?.idioma ?? "",
      fechaHoraInicio: funcion?.fecha_hora_inicio ?? "",
      butacas: r.entradas.map((e) => `${e.ocupacion.butacas.letra_fila}${e.ocupacion.butacas.numero}`),
      candy: [
        ...r.detalle_candy.map((c) => `${c.cantidad} x ${c.productos.nombre}`),
        ...r.venta_combos.map((c) => `${c.cantidad} x ${c.combos.nombre}`),
      ],
      utilizada:
        r.entradas.some((e) => e.valida) ||
        r.detalle_candy.some((c) => c.validada) ||
        r.venta_combos.some((c) => c.validada),
    };
  }
}