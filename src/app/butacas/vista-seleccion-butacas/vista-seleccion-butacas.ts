import { Component, computed, effect, inject, input, numberAttribute, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FuncionStore } from '../../funciones/funcion.store';
import { ButacaStore } from '../butaca.store';
import { ButacaOcupacionStore } from '../butacaOcupacion.store';
import { ButacaModel } from '../butaca.model';
import { PeliculaStore } from '../../peliculas/pelicula.store';
import { enPreventa } from '../../peliculas/pelicula-estado';
import { PerfilStore } from '../../perfiles/perfil.store';
import { calcularEdad, edadMinimaDe } from '../../peliculas/pelicula-edad';
import { ModalEdad } from '../../compra/modal/modal-edad/modal-edad';
import { CompraEnCursoStore } from '../../compra/compra-en-curso.store';
import { FechaPipe } from '../../pipes/pipe-fecha/fecha-pipe';
import { PrecioArsPipe } from '../../pipes/pipe-precio-ars/precio-ars-pipe';
import { ListaEsperaStore } from '../../lista-espera/lista-espera.store';
import { GridButacas } from '../grid-butacas/grid-butacas';

@Component({
  imports: [RouterLink, FechaPipe, PrecioArsPipe, ModalEdad, GridButacas],
  selector: 'app-vista-seleccion-butacas',
  standalone: true,
  styleUrl: './vista-seleccion-butacas.css',
  templateUrl: './vista-seleccion-butacas.html',
})
export class VistaSeleccionButacas implements OnDestroy {

  funcionId = input.required({ transform: numberAttribute });

  private readonly storeFuncion = inject(FuncionStore);
  private readonly storeButacas = inject(ButacaStore);
  private readonly storeOcupacion = inject(ButacaOcupacionStore);
  private readonly storePeliculas = inject(PeliculaStore);
  private readonly compra = inject(CompraEnCursoStore);
  private readonly router = inject(Router);
  private readonly listaEspera = inject(ListaEsperaStore);
  readonly perfil = inject(PerfilStore).perfil;

  readonly seleccionadas = signal<number[]>([]);
  readonly errorMsg = signal<string | null>(null);
  readonly modalEdad = signal(false);
  protected readonly procesando = signal(false);

  readonly estaOcupadaFn = (butaca: ButacaModel) => this.estaOcupada(butaca);
  readonly estaSeleccionadaFn = (butaca: ButacaModel) => this.estaSeleccionada(butaca);

  protected readonly segundosRestantes = this.compra.segundosRestantes;
  protected readonly textoTiempo = this.compra.textoTiempo;

  private readonly ahora = signal(Date.now());
  private readonly intervalo = setInterval(() => this.ahora.set(Date.now()), 1000);

  private confirmadas: number[] = [];
  private cola: Promise<void> = Promise.resolve();

  protected readonly miEspera = computed(() => {
    return this.listaEspera.mias().find((e) => e.funcionId === this.funcionId());
  });

  protected readonly agotada = computed(() => {
    const butacas = this.matriz().flat(2);

    return butacas.length > 0
      && this.seleccionadas().length === 0
      && butacas.every((b) => this.estaOcupada(b));
  });

  protected readonly puedeAnotarse = computed(() => {
    const f = this.funcion();

    return !!f && !this.miEspera() && this.agotada()
      && new Date(f.fechaHoraInicio).getTime() > this.ahora();
  });

  protected readonly turnoPendiente = computed(() => {
    const e = this.miEspera();

    return e && e.estado === 'notificado' && e.butacaId !== null
      && !this.seleccionadas().includes(e.butacaId) ? e : null;
  });

  protected readonly textoTurno = computed(() => {
    const e = this.miEspera();

    if (!e || e.turnoVenceAt === null) return '';
    const s = Math.max(0, Math.floor((e.turnoVenceAt - this.ahora()) / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });

  funcion = computed(() => this.storeFuncion.find(this.funcionId()));

  matriz = computed(() => {
    const salaId = this.funcion()?.salaId;
    return salaId ? this.storeButacas.matrizPorSala(salaId) : [];
  });

  protected readonly pelicula = computed(() => {
    const f = this.funcion();
    return f ? this.storePeliculas.find(f.peliculaId) : undefined;
  });

  protected readonly edadMinima = computed(() => edadMinimaDe(this.pelicula()?.restriccionEdad));

  precioBase = computed(() => {
    const f = this.funcion();

    if (!f) return 0;
    const p = this.pelicula();

    return p && enPreventa(p) ? p.precioPreventa! : f.precio;
  });

  seleccionValida = computed(() => {
    const ids = this.seleccionadas();
    if (ids.length === 0) return false;

    const butacas = this.storeButacas.butacas().filter((b) => ids.includes(b.id));
    if (butacas.length !== ids.length) return false;

    if (new Set(butacas.map((b) => b.letraFila)).size !== 1) return false;
    if (new Set(butacas.map((b) => b.sector)).size !== 1) return false;

    const numeros = butacas.map((b) => b.numero).sort((a, b) => a - b);
    return numeros[numeros.length - 1] - numeros[0] === numeros.length - 1;
  });

  total = computed(() => {
    const base = this.precioBase();
    
    return this.seleccionadas()
      .map((id) => this.storeButacas.butacas().find((b) => b.id === id))
      .filter((b): b is ButacaModel => b !== undefined)
      .reduce((suma, b) => suma + (b.tipo === 'VIP' ? base * 1.5 : base), 0);
  });

  estaSeleccionada(butaca: ButacaModel): boolean {
    return this.seleccionadas().includes(butaca.id);
  }

  estaOcupada(butaca: ButacaModel): boolean {
    if (this.estaSeleccionada(butaca)) return false;
    return this.storeOcupacion.estaNoDisponible(this.funcionId(), butaca.id, this.ahora());
  }

  elegirButaca(butaca: ButacaModel) {
    const seleccionActual = this.seleccionadas();
    this.seleccionadas.set(
      seleccionActual.includes(butaca.id)
        ? seleccionActual.filter((id) => id !== butaca.id)
        : [...seleccionActual, butaca.id],
    );
    this.errorMsg.set(null);

    this.cola = this.cola.then(() => this.sincronizar());
  }

  async continuar() {
    if (!this.seleccionValida()) return;

    await this.cola;
    if (!this.seleccionValida()) return;

    const edadMinimaRequerida = this.edadMinima();
    if (edadMinimaRequerida > 0) {
      const fechaNacimiento = this.perfil()?.fechaNacimiento;

      if (!fechaNacimiento) {
        this.modalEdad.set(true);
        return;
      }
      if (calcularEdad(fechaNacimiento) < edadMinimaRequerida) {
        this.errorMsg.set(`Tenés que tener al menos ${edadMinimaRequerida} años para comprar esta entrada.`);
        return;
      }
    }

    this.irACandy();
  }

  async anotarme() {
    this.procesando.set(true);
    this.errorMsg.set(null);
    try {
      await this.listaEspera.unirse(this.funcionId());
    } catch (error) {
      this.errorMsg.set(this.mensajeDe(error, 'No se pudo anotar en la lista de espera'));
    } finally {
      this.procesando.set(false);
    }
  }

  async salirDeLaLista() {
    this.procesando.set(true);
    this.errorMsg.set(null);
    try {
      await this.listaEspera.salir(this.funcionId());
    } catch (error) {
      this.errorMsg.set(this.mensajeDe(error, 'No se pudo salir de la lista de espera'));
    } finally {
      this.procesando.set(false);
    }
  }

  async tomarTurno() {
    this.procesando.set(true);
    this.errorMsg.set(null);
    try {

      await this.cola;

      const turnoTomado = await this.listaEspera.tomarTurno(this.funcionId());
      this.seleccionadas.set([turnoTomado.butacaId]);
      this.confirmadas = [turnoTomado.butacaId];
      this.compra.fijarReserva(this.funcionId(), [turnoTomado.butacaId], turnoTomado.segundos);

    } catch (error) {
      this.errorMsg.set(this.mensajeDe(error, 'No se pudo tomar la butaca'));
    } finally {
      this.procesando.set(false);
    }
  }

  protected alConfirmarEdad(fechaNacimiento: string) {
    this.modalEdad.set(false);
    this.compra.fechaNacimiento.set(fechaNacimiento);
    this.irACandy();
  }

  private async sincronizar() {
    const butacasObjetivo = this.seleccionadas();

    const seleccionIgual = butacasObjetivo.length === this.confirmadas.length
      && butacasObjetivo.every((id) => this.confirmadas.includes(id));
    if (seleccionIgual) return;

    try {
      const segundos = await this.storeOcupacion.reservar(this.funcionId(), butacasObjetivo);

      this.confirmadas = butacasObjetivo;
      this.compra.fijarReserva(this.funcionId(), butacasObjetivo, segundos);
    } catch (error) {
      this.seleccionadas.set(this.confirmadas);
      this.errorMsg.set(this.mensajeDe(error, 'No se pudo reservar la butaca'));
    }
  }

  private irACandy() {
    this.compra.transicion = true;
    this.router.navigate(['/funcion', this.funcionId(), 'candy']).then((ok) => {
      if (!ok) this.compra.transicion = false;
    });
  }

  private mensajeDe(error: unknown, mensajePorDefecto: string): string {
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
    return mensajePorDefecto;
  }

  constructor() {
    this.storeFuncion.init();
    this.storeButacas.init();
    this.storeOcupacion.init();
    this.storePeliculas.init();

    effect(() => {
      const enCurso = this.compra.funcionId();

      if (enCurso === this.funcionId()) {
        
        this.seleccionadas.set(this.compra.butacaIds());
        this.confirmadas = this.compra.butacaIds();
      } else if (enCurso !== null) {
        this.compra.cancelar();
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);

    if (this.compra.transicion) {
      this.compra.transicion = false;
      return;
    }
    const id = this.funcionId();
    this.cola = this.cola.then(() => this.compra.cancelar(id));
  }
}