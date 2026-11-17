import { Pipe, PipeTransform } from "@angular/core";

const formato = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

@Pipe({ name: "precioArs" })
export class PrecioArsPipe implements PipeTransform {
  transform(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined || valor === "") return "";

    const numero = Number(valor);
    return Number.isFinite(numero) ? formato.format(numero) : "";
  }
}