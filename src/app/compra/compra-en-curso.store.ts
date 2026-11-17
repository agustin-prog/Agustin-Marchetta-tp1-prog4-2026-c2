import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButacaStore } from '../butacas/butaca.store';
import { FuncionStore } from '../funciones/funcion.store';
import { PeliculaStore } from '../peliculas/pelicula.store';
import { ProductoStore } from '../candy/producto.store';
import { ComboStore } from '../candy/combo.store';
import { enPreventa } from '../peliculas/pelicula-estado';
import { PerfilStore } from '../perfiles/perfil.store';
import { CuponBienvenida, CuponStore } from '../cupones/cupon.store';
import { CuponDisponible } from '../cupones/cupon-regla.model';
import { CompraEnCursoReservaService } from './services/compra-en-curso-reserva.service';
import { CompraEnCursoDescuentosService } from './services/compra.en-curso-descuentos.service';
import { CompraEnCursoCarritoService } from './services/compra-en-curso-carrito.service';
import { CompraEnCursoPagoService } from './services/compra-en-curso-pago.service';

@Injectable({ providedIn: 'root' })
export class CompraEnCursoStore {
  
  private readonly reservaService = inject(CompraEnCursoReservaService);
  private readonly descuentosService = inject(CompraEnCursoDescuentosService);
  private readonly pagoService = inject(CompraEnCursoPagoService);
  private readonly carritoService = inject(CompraEnCursoCarritoService);
  private readonly router = inject(Router);
  private readonly funcionStore = inject(FuncionStore);
  private readonly butacaStore = inject(ButacaStore);
  private readonly peliculaStore = inject(PeliculaStore);
  private readonly productoStore = inject(ProductoStore);
  private readonly comboStore = inject(ComboStore);
  private readonly perfilStore = inject(PerfilStore);

  readonly funcionId = signal<number | null>(null);
  readonly butacaIds = signal<number[]>([]);
  readonly fechaNacimiento = signal<string | null>(null);
  readonly productos = signal<Record<number, number>>({});
  readonly combos = signal<Record<number, number>>({});
  readonly cuponBienvenida = signal<CuponBienvenida | null>(null);
  readonly usarCredito = signal(false);
  readonly usarEntradaGratis = signal(false);
  readonly entradasGratis = signal(0);
  readonly cuponesPersonales = signal<CuponDisponible[]>([]);
  readonly cuponElegidoId = signal<number | null>(null);

  transicion = false;

  private readonly venceEn = signal<number | null>(null);
  private readonly ahora = signal(Date.now());
  intervalo?: ReturnType<typeof setInterval>;

  readonly segundosRestantes = computed(() => {
    const vence = this.venceEn();
    return vence === null ? null : Math.max(0, Math.floor((vence - this.ahora()) / 1000));
  });

  readonly textoTiempo = computed(() => {
    const s = this.segundosRestantes();
    
    if (s === null) return '';

    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });

  private readonly preciosEntradas = computed(() => {
    const id = this.funcionId();
    const funcion = id === null ? undefined : this.funcionStore.find(id);

    if (!funcion) return [];

    const pelicula = this.peliculaStore.find(funcion.peliculaId);
    const base = pelicula && enPreventa(pelicula) ? pelicula.precioPreventa! : funcion.precio;

    return this.butacaIds()
      .map((butacaId) => this.butacaStore.butacas()
      .find((b) => b.id === butacaId))
      .filter((b) => b !== undefined)
      .map((b) => (b.tipo === 'VIP' ? base * 1.5 : base));
  });

  readonly totalEntradas = computed(() => this.preciosEntradas().reduce((suma, p) => suma + p, 0));

  readonly descuentoEntradaGratis = computed(() => {
    const precios = this.preciosEntradas();

    if (!this.usarEntradaGratis() || this.entradasGratis() === 0 || precios.length === 0) return 0;

    return Math.min(...precios);
  });

  readonly cuponesElegibles = computed(() => {
    const base = ( this.total() - this.descuentoEntradaGratis() );
    return this.cuponesPersonales().filter((c) => c.montoMinimo === null || base >= c.montoMinimo);
  });

  readonly cuponAplicado = computed(() => {
    const bienvenida = this.cuponBienvenida();
    if (bienvenida) return { porcentaje: bienvenida.porcentaje, nombre: 'Cupón de bienvenida' };

    const elegido = this.cuponesElegibles().find((c) => c.id === this.cuponElegidoId());
    return elegido ? { porcentaje: elegido.porcentaje, nombre: elegido.nombre } : null;
  });

  private readonly cuponPersonalId = computed(() => 
    !this.cuponBienvenida() && this.cuponesElegibles().some((c) => c.id === this.cuponElegidoId())
      ? this.cuponElegidoId() : null,
  );

  readonly totalCandy = computed(() => {
    const deProductos = Object.entries(this.productos()).reduce((suma, [id, cantidad]) => {

      const p = this.productoStore.productos().find((x) => x.id === Number(id));
      return suma + (p ? p.precio * cantidad : 0);
    }, 0);

    const deCombos = Object.entries(this.combos()).reduce((suma, [id, cantidad]) => {

      const c = this.comboStore.combos().find((x) => x.id === Number(id));
      return suma + (c ? c.precio * cantidad : 0);
    }, 0);

    return deProductos + deCombos;
  });

  readonly total = computed(() => this.totalEntradas() + this.totalCandy());

  readonly descuento = computed(() => {
    const cupon = this.cuponAplicado();
    const base = ( this.total() - this.descuentoEntradaGratis() );
    return cupon ? Math.round(base * cupon.porcentaje) / 100 : 0;
  });

  readonly creditoDisponible = computed(() => this.perfilStore.perfil()?.credito ?? 0);

  readonly creditoAplicado = computed(() =>
    this.usarCredito()
      ? Math.min(this.creditoDisponible(), this.total() - this.descuentoEntradaGratis() - this.descuento())
      : 0,
  );

  readonly totalFinal = computed(
    () => this.total() - this.descuentoEntradaGratis() - this.descuento() - this.creditoAplicado(),
  );

  constructor() {
    effect(() => {
      if (this.segundosRestantes() === 0) {
        this.limpiar();
        this.router.navigate(['/peliculas']);
      }
    });
  }

  // ---------- reserva ----------

  fijarReserva(funcionId: number, butacaIds: number[], segundos: number | null): void {
    
    this.reservaService.fijarReserva(this, funcionId, butacaIds, segundos);
  }

  async cancelar(funcionId?: number): Promise<void> {
    await this.reservaService.cancelar(this, funcionId);
  }

  limpiar(): void {
    this.reservaService.limpiar(this);
  }

  // ---------- carrito ----------

  cantidadProducto(id: number): number {
    return this.carritoService.cantidad(this.productos(), id);
  }

  cantidadCombo(id: number): number {
    return this.carritoService.cantidad(this.combos(), id);
  }

  cambiarProducto(id: number, delta: number): void {
    this.productos.update((actual) => this.carritoService.cambiar(actual, id, delta));
  }

  cambiarCombo(id: number, delta: number): void {
    this.combos.update((actual) => this.carritoService.cambiar(actual, id, delta));
  }

  // ---------- descuentos ----------

  async cargarDescuentos(perfilId: string | undefined): Promise<void> {
    const { cupon, entradas, personales } = await this.descuentosService.cargarDescuentos(perfilId);

    this.cuponBienvenida.set(cupon);
    this.entradasGratis.set(entradas);
    this.cuponesPersonales.set(personales);
  }

  elegirCupon(valor: string): void {
    this.cuponElegidoId.set(this.descuentosService.elegirCupon(valor));
  }

  // ---------- pago ----------

  async pagar(): Promise<string> {
    const funcionId = this.funcionId();
    if (funcionId === null) throw new Error('No hay una compra en curso.');

    const qr = await this.pagoService.pagar(
      funcionId,
      this.butacaIds(),
      this.productos(),
      this.combos(),
      this.usarCredito(),
      this.fechaNacimiento(),
      this.usarEntradaGratis(),
      this.cuponPersonalId() ?? null,
    );

    this.limpiar();
    return qr;
  }
}