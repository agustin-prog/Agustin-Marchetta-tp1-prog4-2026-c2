import { effect, inject, Injectable, signal } from "@angular/core";
import { PerfilStore } from "../perfiles/perfil.store";
import { ListaEsperaAdminModel, ListaEsperaModel, TurnoTomado } from "./lista-espera.model";
import { ListaEsperaService } from "./lista-espera.service";
import { supabase } from "../supabase.client";

@Injectable({ providedIn: "root" })
export class ListaEsperaStore {

    private readonly service = inject(ListaEsperaService);
    private readonly perfilStore = inject(PerfilStore);
    private readonly db = supabase

    readonly mias = signal<ListaEsperaModel[]>([]);
    readonly admin = signal<ListaEsperaAdminModel[]>([]);

    private adminActivo = false;

    constructor() {
        effect(() => {
            const id = this.perfilStore.perfil()?.id;

            if (!id) { this.mias.set([]); return; }

            this.service.cargarUsuario()
            .then((data) => {
                this.mias.set(data);
            })
            .catch((e) => console.error("No se pudo cargar tu lista de espera", e));
        });

        this.db.channel("lista-espera-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "lista_espera" }, () => {

            this.service.cargarUsuario().then((data) => this.mias.set(data)).catch(() => {});

            if (this.adminActivo) {
                this.service.cargarAdmin().then((data) => this.admin.set(data)).catch(() => {});
            }
        })
        .subscribe();
    }

    async cargarAdmin(): Promise<void> {
        this.adminActivo = true;
        const data = await this.service.cargarAdmin();
        this.admin.set(data);
    }

    async unirse(funcionId: number): Promise<void> {
        await this.service.unirse(funcionId);
        const data = await this.service.cargarUsuario();
        this.mias.set(data);
    }

    async salir(funcionId: number): Promise<void> {
        await this.service.salir(funcionId);
        const data = await this.service.cargarUsuario();
        this.mias.set(data);
    }

    async tomarTurno(funcionId: number): Promise<TurnoTomado> {
        return this.service.tomarTurno(funcionId);
    }
}