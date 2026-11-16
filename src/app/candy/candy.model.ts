export interface CategoriaModel { 
  id: number; 
  nombre: string; 
}

export interface ProductoRow {
  id: number; 
  categoria_id: number; 
  nombre: string; 
  imagen_url: string | null; 
  precio: number;
  activo: boolean;
}

export interface ProductoModel {
  id: number; 
  categoriaId: number; 
  nombre: string; 
  imagenUrl: string; 
  precio: number;
  activo: boolean;
}

export type ProductoInput = Omit<ProductoModel, "id" | "activo">;

export interface ComboItem { 
  productoId: number; 
  cantidad: number; 
}

export interface ComboRow {
  id: number; 
  nombre: string; 
  precio: number; 
  imagen_url: string | null;
  items_combos: { producto_id: number; cantidad: number }[];
  activo: boolean;
}

export interface ComboModel {
  id: number; 
  nombre: string; 
  precio: number; 
  imagenUrl: string; 
  items: ComboItem[];
  activo: boolean;
}

export type ComboInput = Omit<ComboModel, "id" | "activo">;