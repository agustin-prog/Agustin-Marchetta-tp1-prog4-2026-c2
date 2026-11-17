import { Injectable, inject } from "@angular/core";
import { ImagenService, CarpetaImagen } from "./imagen.service";

@Injectable({ providedIn: "root" })
export class ImagenStore {
  private readonly service = inject(ImagenService);

  subir(carpeta: CarpetaImagen, archivo: File): Promise<string> {
    return this.service.subir(carpeta, archivo);
  }

  borrar(url: string | null): Promise<void> {
    return this.service.borrar(url);
  }
}