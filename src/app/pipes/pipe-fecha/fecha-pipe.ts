import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "fechaPipe" })
export class FechaPipe implements PipeTransform {
  transform(valor: string | number | Date | null | undefined, conHora = true): string {
    if (valor === null || valor === undefined || valor === "") return "";
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return "";

    return new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      weekday: "short",
      day: "numeric",
      month: "short",
      ...(conHora ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    }).format(fecha);
  }
}