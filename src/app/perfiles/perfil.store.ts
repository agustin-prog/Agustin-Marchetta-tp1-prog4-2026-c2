import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase.client";
import { PerfilModel, Rol } from "./perfil.model";

interface PerfilRow {
    id: string;
    nombre: string | null;
    apellido: string | null;
    fecha_nacimiento: string | null;
    rol: Rol;
    puntos: number;
    credito: number;
    tipo_sangre: string | null;
    color_ojos: string | null;
    dias_vacaciones: number | null;
}

@Injectable({ providedIn: "root" })
export class PerfilStore {

    readonly perfil = signal<PerfilModel | null>(null);
    readonly loading = signal(false);

    async cargar(userId: string | null): Promise<void> {
        if (!userId) {                       // logout → perfil null
            this.perfil.set(null);
            return;
        }

        this.loading.set(true);
        const { data, error } = await supabase
            .from("perfiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;
        this.perfil.set(data ? this.mapear(data) : null);
        this.loading.set(false);
    }

    private mapear(row: PerfilRow): PerfilModel {
        return {
            id: row.id,
            nombre: row.nombre,
            apellido: row.apellido,
            fechaNacimiento: row.fecha_nacimiento,
            rol: row.rol,
            puntos: row.puntos,
            credito: row.credito,
            tipoSangre: row.tipo_sangre,
            colorOjos: row.color_ojos,
            diasVacaciones: row.dias_vacaciones,
        };
    }
}