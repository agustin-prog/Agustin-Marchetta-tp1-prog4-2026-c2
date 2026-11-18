import { Component, input, model } from "@angular/core";

@Component({
  selector: 'app-selector-fecha',
  standalone: true,
  templateUrl: './selector-fecha.html',
  styleUrl: './selector-fecha.css',
})
export class SelectorFecha {
  value = input<string>("");
  valueChange = model<string>("");

  texto = "";

  constructor() {
    if (this.value()) {
      this.texto = this.isoToTexto(this.value());
    }
  }

  proximoSabado(): number {
    const hoy = new Date();
    return (6 - hoy.getDay() + 7) % 7;
  }

  proximoDomingo(): number {
    const hoy = new Date();
    return (7 - hoy.getDay()) % 7;
  }

  elegir(diasDesdeHoy: number) {
    const d = new Date();
    d.setDate(d.getDate() + diasDesdeHoy);
    this.emitir(d);
  }

  escribir(evento: Event) {
    const valor = (evento.target as HTMLInputElement).value;
    this.texto = valor;

    const partes = valor.split("/");

    if (partes.length === 3) {
      const [dd, mm, aaaa] = partes.map((p) => Number(p));

      if (!isNaN(dd) && !isNaN(mm) && !isNaN(aaaa) && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const iso = `${aaaa}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
        this.valueChange.set(iso);
      }
    }
  }

  private emitir(d: Date) {
    const iso = d.toISOString().slice(0, 10);

    this.texto = this.isoToTexto(iso);
    this.valueChange.set(iso);
  }

  private isoToTexto(iso: string): string {
    const [aaaa, mm, dd] = iso.split("-");
    return `${dd}/${mm}/${aaaa}`;
  }
}