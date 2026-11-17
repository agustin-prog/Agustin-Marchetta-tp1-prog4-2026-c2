import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { VentaRow, VentaValidacion } from "./validacion.model";

@Injectable({ providedIn: "root" })
export class ValidacionService {
  private readonly db = supabase;

  async buscarCompra(qr: string): Promise<VentaValidacion | null> {
    const { data, error } = await this.db
      .from("ventas")
      .select(`
        id, estado, qr_codigo,
        entradas(id, valida, ocupacion(butacas(letra_fila, numero),
          funciones(fecha_hora_inicio, peliculas(nombre), salas(nombre)))),
        detalle_candy(cantidad, validada, productos(nombre)),
        venta_combos(cantidad, validada, combos(nombre))
      `)
      .eq("qr_codigo", qr.trim())
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapear(data as unknown as VentaRow) : null;
  }

  async validarEntradas(ventaId: number): Promise<void> {
    const { data, error } = await this.db
      .from("entradas")
      .update({ valida: true })
      .eq("venta_id", ventaId)
      .eq("valida", false)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Las entradas ya estaban validadas.");

    await this.registrar("validar_entrada", `Venta ${ventaId}: ${data.length} entrada(s)`);
  }

  async validarCandy(ventaId: number): Promise<void> {
    const productos = await this.db
      .from("detalle_candy")
      .update({ validada: true })
      .eq("venta_id", ventaId)
      .eq("validada", false)
      .select("id");

    if (productos.error) throw productos.error;

    const combos = await this.db
      .from("venta_combos")
      .update({ validada: true })
      .eq("venta_id", ventaId)
      .eq("validada", false)
      .select("id");
    if (combos.error) throw combos.error;

    const cantidad = (productos.data?.length ?? 0) + (combos.data?.length ?? 0);
    if (cantidad === 0) throw new Error("No hay candy pendiente de entregar.");

    await this.registrar("validar_candy", `Venta ${ventaId}: ${cantidad} ítem(s) entregado(s)`);
  }

  private async registrar(accion: string, detalle: string): Promise<void> {
    const { data: { user } } = await this.db.auth.getUser();
    const { error } = await this.db.from("log").insert({ perfil_id: user?.id, accion, detalle });
    
    if (error) throw error;
  }

  private mapear(row: VentaRow): VentaValidacion {
    const primera = row.entradas[0]?.ocupacion.funciones;
    const candy = [
      ...row.detalle_candy.map((c) => ({ nombre: c.productos.nombre, cantidad: c.cantidad, validada: c.validada })),
      ...row.venta_combos.map((c) => ({ nombre: c.combos.nombre, cantidad: c.cantidad, validada: c.validada })),
    ];

    const entradasPendientes = row.entradas.filter((e) => !e.valida).length;
    const candyPendientes = candy.filter((c) => !c.validada).length;

    return {
      id: row.id,
      estado: row.estado,
      qr: row.qr_codigo,
      pelicula: primera?.peliculas.nombre ?? "",
      sala: primera?.salas.nombre ?? "",
      fechaHoraInicio: primera?.fecha_hora_inicio ?? "",
      butacas: row.entradas.map((e) => `${e.ocupacion.butacas.letra_fila}${e.ocupacion.butacas.numero}`),
      entradasTotal: row.entradas.length,
      entradasPendientes,
      candy,
      candyPendientes,
      consumida: entradasPendientes === 0 && candyPendientes === 0,
    };
  }
}