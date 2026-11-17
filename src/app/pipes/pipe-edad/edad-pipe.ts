import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "edad" })
export class EdadPipe implements PipeTransform {
    
  transform(nacimiento: string | Date | null | undefined): number | null {
    if (!nacimiento) return null;

    let anio: number, mes: number, dia: number;
    if (typeof nacimiento === "string") {
      [anio, mes, dia] = nacimiento.slice(0, 10).split("-").map(Number);
    } else {
      anio = nacimiento.getFullYear();
      mes = nacimiento.getMonth() + 1;
      dia = nacimiento.getDate();
    }
    
    if (!anio || !mes || !dia) return null;

    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    const yaCumplio = hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
    if (!yaCumplio) edad--;

    return edad >= 0 ? edad : null;
  }
}