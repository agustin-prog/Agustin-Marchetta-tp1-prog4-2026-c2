import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "duracion" })
export class DuracionPipe implements PipeTransform {
  transform(minutos: number | string | null | undefined): string {
    
    if (minutos === null || minutos === undefined || minutos === "") return "";

    const valor = Number(minutos);
    if (!Number.isFinite(valor) || valor < 0) return "";

    const total = Math.round(valor);
    const horas = Math.floor(total / 60);
    const resto = total % 60;

    if (horas === 0) return `${resto} min`;
    return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
  }
}