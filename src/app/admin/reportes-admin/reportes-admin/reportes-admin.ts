import { Component, computed, effect, inject, signal } from "@angular/core";
import { ReporteStore } from "../../../reportes/reportes.store";
import { haceDias, hoy, rangoMes, rangoSemana } from "../../../reportes/rangos";
import { descargarExcel, descargarPdf, formatear, TablaReporte } from "../../../reportes/exportar-reporte";
import { mensajeDeError } from "../../../shared/errores";

type TipoReporte = "facturacion" | "entradas" | "vistas-semana" | "vistas-mes" | "candy";

@Component({
  selector: 'app-reportes-admin',
  styleUrl: './reportes-admin.css',
  templateUrl: './reportes-admin.html',
})
export class ReportesAdmin {

  private readonly store = inject(ReporteStore);

  protected readonly opciones: { valor: TipoReporte; texto: string }[] = [
    { valor: "facturacion", texto: "Facturación por día" },
    { valor: "entradas", texto: "Entradas vendidas por día" },
    { valor: "vistas-semana", texto: "Películas más vistas por semana" },
    { valor: "vistas-mes", texto: "Películas más vistas por mes" },
    { valor: "candy", texto: "Producto del Candy Bar más vendido" },
  ];

  protected readonly tipo = signal<TipoReporte>("facturacion");
  protected readonly desde = signal(haceDias(30));
  protected readonly hasta = signal(hoy());
  protected readonly referencia = signal(hoy());
  protected readonly tabla = signal<TablaReporte | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly haceDias30 = haceDias(30);
  protected readonly hoyIso = hoy();

  private ultimoPedido = 0;

  protected readonly esPorPeriodo = computed(() => this.tipo().startsWith("vistas"));

  protected readonly rango = computed(() => {
    switch (this.tipo()) {
      case "vistas-semana": return rangoSemana(this.referencia());

      case "vistas-mes": return rangoMes(this.referencia());

      default: return { desde: this.desde(), hasta: this.hasta() };
    }
  });

  protected readonly textoPeriodo = computed(() =>
    `${formatear(this.rango().desde, "fecha")} al ${formatear(this.rango().hasta, "fecha")}`,
  );

  protected setRango(desde: string, hasta: string) {
    this.desde.set(desde);
    this.hasta.set(hasta);
  }

  protected esteMes() {
    const r = rangoMes(hoy());
    this.setRango(r.desde, r.hasta);
  }

  protected formatear = formatear;

  protected async exportar(formato: "pdf" | "excel") {
    const t = this.tabla();
    if (!t) return;

    const nombre = `${t.titulo} ${this.rango().desde} a ${this.rango().hasta}`;
    try {
      if (formato === "pdf") {
        await descargarPdf(t, nombre, `Período: ${this.textoPeriodo()}`);
      } else {
        await descargarExcel(t, nombre, this.textoPeriodo());
      }
    } catch (error) {
      this.error.set(mensajeDeError(error, "No se pudo exportar el reporte."));
    }
  }

  private async cargar(tipo: TipoReporte, desde: string, hasta: string) {
    if (!desde || !hasta || desde > hasta) {
      this.tabla.set(null);
      this.error.set("Revisá las fechas: el inicio no puede ser posterior al fin.");
      return;
    }

    const numero = ++this.ultimoPedido;
    this.cargando.set(true);
    this.error.set(null);

    try {
      let t: TablaReporte;
      switch (tipo) {
        case "facturacion": t = await this.store.facturacion(desde, hasta); break;

        case "entradas": t = await this.store.entradas(desde, hasta); break;

        case "vistas-semana": t = await this.store.peliculasVistas(desde, hasta, "Películas más vistas de la semana"); break;

        case "vistas-mes": t = await this.store.peliculasVistas(desde, hasta, "Películas más vistas del mes"); break;

        default: t = await this.store.candy(desde, hasta);
      }
      if (numero === this.ultimoPedido) this.tabla.set(t);
      
    } catch (error) {
      if (numero === this.ultimoPedido) {
        this.tabla.set(null);
        this.error.set(mensajeDeError(error, "No se pudo generar el reporte."));
      }
    } finally {
      if (numero === this.ultimoPedido) this.cargando.set(false);
    }
  }

  constructor() {
    effect(() => {
      const r = this.rango();
      this.cargar(this.tipo(), r.desde, r.hasta);
    });
  }
}
