import { Injectable } from "@angular/core";
import { supabase } from "../supabase.client";

export type CarpetaImagen = "peliculas" | "productos" | "combos";

const BUCKET = "imagenes";
const MAX_BYTES = 2 * 1024 * 1024;
const EXTENSIONES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

@Injectable({ providedIn: "root" })
export class ImagenService {
  private readonly db = supabase;

  // sube la imagen y devuelve su URL pública
  async subir(carpeta: CarpetaImagen, archivo: File): Promise<string> {
    const extension = EXTENSIONES[archivo.type];
    if (!extension) throw new Error("La imagen tiene que ser JPG, PNG o WEBP.");
    if (archivo.size > MAX_BYTES) throw new Error("La imagen no puede pesar más de 2 MB.");

    const ruta = `${carpeta}/${crypto.randomUUID()}.${extension}`;

    const { error } = await this.db.storage
      .from(BUCKET)
      .upload(ruta, archivo, { contentType: archivo.type, cacheControl: "31536000" });

    if (error) throw error;

    return this.db.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
  }

  async borrar(url: string | null): Promise<void> {
    const marca = `/object/public/${BUCKET}/`;
    const posicion = url?.indexOf(marca) ?? -1;
    
    if (!url || posicion === -1) return;

    const ruta = url.slice(posicion + marca.length);
    const { error } = await this.db.storage.from(BUCKET).remove([ruta]);

    if (error) throw error;
  }
}