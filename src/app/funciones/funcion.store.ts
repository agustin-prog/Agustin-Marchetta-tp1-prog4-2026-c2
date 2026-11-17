import { computed, inject, Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { FuncionService } from "./funcion.service";
import { FuncionRpcService } from "./funcion-rpc.service";
import { FuncionInput, FuncionModel, CompraAnonima, ResultadoCancelacion, ResumenCancelacion } from "./funcion.model";

@Injectable({ providedIn: "root" })
export class FuncionStore {
    private readonly db = supabase;
    private readonly service = inject(FuncionService);
    private readonly rpc = inject(FuncionRpcService);

    private readonly todas = signal<FuncionModel[]>([]);

    readonly funciones = computed(() => this.todas().filter((f) => !f.cancelada));

    readonly loading = signal(true);

    private yaInicializado = false;

    readonly peliculaIdsConFunciones = computed(() => {
        const ahora = Date.now();
        return new Set(
            this.funciones()
                .filter((f) => new Date(f.fechaHoraInicio).getTime() > ahora)
                .map((f) => f.peliculaId),
        );
    });

    init() {
        if (this.yaInicializado) return; // guard
        this.yaInicializado = true;

        this.load();
        this.db
            .channel("funciones-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "funciones" }, () => this.load())
            .subscribe();
    }

    async load(): Promise<void> {
        const data = await this.service.load();
        this.todas.set(data);
        this.loading.set(false);
    }

    buscarPorPelicula(peliculaId: number): FuncionModel[] {
        return this.funciones().filter((f) => f.peliculaId === peliculaId);
    }

    buscarPorPeliculaAdmin(peliculaId: number): FuncionModel[] {
        return this.todas().filter((f) => f.peliculaId === peliculaId);
    }

    find(id: number): FuncionModel | undefined {
        return this.funciones().find((f) => Number(f.id) === Number(id));
    }

    async add(input: FuncionInput): Promise<void> {
        await this.service.add(input);
        await this.load();
    }

    async addMany(inputs: FuncionInput[]): Promise<void> {
        await this.service.addMany(inputs);
        await this.load();
    }

    async update(id: number, input: FuncionInput): Promise<void> {
        await this.service.update(id, input);
        await this.load();
    }

    async remove(id: number): Promise<void> {
        await this.service.remove(id);
        await this.load();
    }

    async resumenCancelacion(id: number): Promise<ResumenCancelacion> {
        return this.rpc.resumenCancelacion(id);
    }

    async cancelar(id: number): Promise<ResultadoCancelacion> {
        const resultado = await this.rpc.cancelar(id);
        await this.load();
        return resultado;
    }

    async comprasAnonimas(id: number): Promise<CompraAnonima[]> {
        return this.rpc.comprasAnonimas(id);
    }
}