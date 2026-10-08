import { Injectable, effect, inject, signal } from "@angular/core";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase.client";
import { PerfilStore } from "./perfiles/perfil.store";

@Injectable({ providedIn: "root"})
export class AuthService{

    private readonly perfilStore = inject(PerfilStore);

    readonly session = signal<Session | null>(null);

    constructor(){
        
        supabase.auth
        .getSession()
        .then(({data}) => this.session.set(data.session));

        supabase.auth.
        onAuthStateChange((_,s) => this.session.set(s));

        effect(() => {

            const userId = this.session()?.user.id ?? null;

            this.perfilStore.cargar(userId);
        });
    }

    async iniciarSesion(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }

    async registrarse(email: string, password: string, datos: Record<string, unknown>) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: datos },
        });
        if (error) throw error;
    }

    async iniciarConOAuth(provider: "github" | "google") {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/peliculas`,  // vuelve al inicio tras inciar sesion con OAuth
            },
        });
        if (error) throw error;
    }

    async cerrarSesion() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};
