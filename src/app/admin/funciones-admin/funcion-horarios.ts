import { Formato, FuncionInput, Idioma } from "../../funciones/funcion.model";
import { SalaOcupacion } from "../../salas/sala.model";

export const APERTURA = "11:00";
export const CIERRE = "23:30";
export const LIMPIEZA_MIN = 30;

const MIN = 60_000;

const pad = (n: number) => String(n).padStart(2, "0");

export const formatoDia = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function diasEntre(desde: string, hasta: string): string[] {
  const dias: string[] = [];
  const d = new Date(`${desde}T00:00`);
  const fin = new Date(`${hasta}T00:00`);

  while (d <= fin) {
    dias.push(formatoDia(d));
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

const choca = (ocupadas: SalaOcupacion[], salaId: number, inicio: number, fin: number) =>
  ocupadas.some((o) => o.salaId === salaId && o.inicio < fin && inicio < o.fin);

export interface GeneradorInput {
  peliculaId: number;
  duracionMin: number;
  fechaDesde: string;
  fechaHasta: string;
  horarios: string[];            
  salaIds: number[];            
  ocupadas: SalaOcupacion[];
  formato: Formato;
  idioma: Idioma;
  precio: number;
}

export interface HorarioOmitido {
  hora: string;
  motivo: string;
}

export interface ResumenDia {
  dia: string;
  pedidas: number;
  creadas: number;
  omitidos: HorarioOmitido[];
}

export interface ResultadoGeneracion {
  funciones: FuncionInput[];
  dias: ResumenDia[];
}

export function generarFunciones(p: GeneradorInput, ahora = Date.now()): ResultadoGeneracion {
  const bloque = (p.duracionMin + LIMPIEZA_MIN) * MIN;     
  const ocupadas = [...p.ocupadas];                        
  const horarios = [...new Set(p.horarios)].sort();
  const funciones: FuncionInput[] = [];
  const dias: ResumenDia[] = [];

  for (const dia of diasEntre(p.fechaDesde, p.fechaHasta)) {
    const resumen: ResumenDia = { dia, pedidas: horarios.length, creadas: 0, omitidos: [] };
    const cierre = new Date(`${dia}T${CIERRE}`).getTime();

    for (const hora of horarios) {
      const inicio = new Date(`${dia}T${hora}`).getTime();

      if (inicio <= ahora) {
        resumen.omitidos.push({ hora, motivo: "ya pasó" });
        continue;
      }
      
      if (inicio + p.duracionMin * MIN > cierre) {
        resumen.omitidos.push({ hora, motivo: `terminaría después del cierre (${CIERRE})` });
        continue;
      }

      const salaId = p.salaIds.find((id) => !choca(ocupadas, id, inicio, inicio + bloque));
      if (salaId === undefined) {
        resumen.omitidos.push({ hora, motivo: "no hay sala libre" });
        continue;
      }

      ocupadas.push({ salaId, inicio, fin: inicio + bloque });
      funciones.push({
        peliculaId: p.peliculaId,
        salaId,
        fechaHoraInicio: new Date(inicio).toISOString(),
        formato: p.formato,
        idioma: p.idioma,
        precio: p.precio,
      });
      resumen.creadas++;
    }

    dias.push(resumen);
  }

  return { funciones, dias };
}