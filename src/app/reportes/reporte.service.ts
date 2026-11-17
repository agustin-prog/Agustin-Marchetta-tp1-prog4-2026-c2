import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { TablaReporte } from "./exportar-reporte";

@Injectable({ providedIn: "root" })
export class ReporteService {
  private readonly db = supabase;

  async topPeliculas(cantidad: number): Promise<{ peliculaId: number; cantidad: number }[]> {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    const fechaLimite = hace30Dias.toISOString();

    const { data, error } = await this.db
      .from("ocupacion")
      .select("funcion_id, funciones(pelicula_id)")
      .eq("estado", "confirmada")
      .gte("created_at", fechaLimite);

    if (error) throw error;

    const conteoButacas = new Map<number, number>();

    (data ?? []).forEach((o: any) => {
      const peliculaId = o.funciones?.pelicula_id;
      if (peliculaId) {
        conteoButacas.set(peliculaId, (conteoButacas.get(peliculaId) ?? 0) + 1);
      }
    });

    return Array.from(conteoButacas.entries())
      .map(([peliculaId, cantidad]) => ({ peliculaId, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, cantidad);
  }

  private async llamar<T>(funcion: string, desde: string, hasta: string): Promise<T[]> {
    const { data, error } = await this.db.rpc(funcion, { p_desde: desde, p_hasta: hasta });
    if (error) throw error;
    return (data ?? []) as T[];
  }

  async facturacion(desde: string, hasta: string): Promise<TablaReporte> {
    const datos = await this.llamar<{ dia: string; ventas: number; total: number }>("reporte_facturacion", desde, hasta);
    return {
      titulo: "Facturación por día",
      columnas: [
        { titulo: "Día", tipo: "fecha" },
        { titulo: "Ventas", tipo: "entero" },
        { titulo: "Facturación", tipo: "moneda" },
      ],
      filas: datos.map((d) => [d.dia, Number(d.ventas), Number(d.total)]),
      totales: [
        "Total",
        datos.reduce((s, d) => s + Number(d.ventas), 0),
        datos.reduce((s, d) => s + Number(d.total), 0),
      ],
    };
  }

  async entradas(desde: string, hasta: string): Promise<TablaReporte> {
    const datos = await this.llamar<{ dia: string; entradas: number }>("reporte_entradas", desde, hasta);
    return {
      titulo: "Entradas vendidas por día",
      columnas: [
        { titulo: "Día", tipo: "fecha" },
        { titulo: "Entradas", tipo: "entero" },
      ],
      filas: datos.map((d) => [d.dia, Number(d.entradas)]),
      totales: ["Total", datos.reduce((s, d) => s + Number(d.entradas), 0)],
    };
  }

  async peliculasVistas(desde: string, hasta: string, titulo: string): Promise<TablaReporte> {
    const datos = await this.llamar<{ pelicula: string; vistas: number }>("reporte_peliculas_vistas", desde, hasta);
    return {
      titulo,
      columnas: [
        { titulo: "Película", tipo: "texto" },
        { titulo: "Entradas validadas", tipo: "entero" },
      ],
      filas: datos.map((d) => [d.pelicula, Number(d.vistas)]),
    };
  }

  async candy(desde: string, hasta: string): Promise<TablaReporte> {
    const datos = await this.llamar<{ item: string; tipo: string; cantidad: number; monto: number }>("reporte_candy", desde, hasta);
    return {
      titulo: "Candy Bar: más vendidos",
      columnas: [
        { titulo: "Producto", tipo: "texto" },
        { titulo: "Tipo", tipo: "texto" },
        { titulo: "Unidades", tipo: "entero" },
        { titulo: "Facturado", tipo: "moneda" },
      ],
      filas: datos.map((d) => [d.item, d.tipo, Number(d.cantidad), Number(d.monto)]),
    };
  }
}