import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";
import { CategoriaModel } from "./candy.model";

@Injectable({ providedIn: "root" })
export class CategoriaService {
  private readonly db = supabase;

  async load(): Promise<CategoriaModel[]> {
    const { data, error } = await this.db
      .from("categorias")
      .select("*")
      .order("nombre");

    if (error) throw error;
    return data as CategoriaModel[];
  }

  async add(nombre: string): Promise<void> {
    const { error } = await this.db
      .from("categorias")
      .insert({ nombre: nombre.trim() });

    if (error) throw error;
  }

  async update(id: number, nombre: string): Promise<void> {
    const { error } = await this.db
      .from("categorias")
      .update({ nombre: nombre.trim() })
      .eq("id", id);

    if (error) throw error;
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.db
      .from("categorias")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}