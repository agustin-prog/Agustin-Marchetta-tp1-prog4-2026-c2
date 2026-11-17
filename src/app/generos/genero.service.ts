import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { GeneroModel, GeneroPatch } from "./genero.model";

@Injectable({ providedIn: "root" })
export class GeneroService {
  private readonly db = supabase;

  async load(): Promise<GeneroModel[]> {
    const { data, error } = await this.db
      .from("generos")
      .select("*")
      .order("id");

    if (error) throw error;
    return data ?? [];
  }

  async add(nombre: string): Promise<void> {
    const { error } = await this.db
      .from("generos")
      .insert({ nombre });

    if (error) throw error;
  }

  async update(id: number, patch: GeneroPatch): Promise<void> {
    const { error } = await this.db
      .from("generos")
      .update({
        ...(patch.nombre !== undefined && { nombre: patch.nombre }),
      })
      .eq("id", id);

    if (error) throw error;
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.db
      .from("generos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}