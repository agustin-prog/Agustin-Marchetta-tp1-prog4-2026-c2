export interface ResenaRow {
  id: number;
  perfil_id: string;
  pelicula_id: number;
  estrellas: number;
  comentario: string | null;
  created_at: string;
}

export interface ResenaModel {
  id: number;
  perfilId: string;
  peliculaId: number;
  estrellas: number;
  comentario: string;
  fecha: string;
}

export interface ResenaConPelicula {
  id: number;
  peliculaId: number;
  pelicula: string;
  estrellas: number;
  comentario: string;
  fecha: string;
}