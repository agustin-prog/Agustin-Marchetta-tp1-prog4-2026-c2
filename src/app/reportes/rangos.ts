const pad = (n: number) => String(n).padStart(2, '0');
const aIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const leer = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};

export const hoy = () => aIso(new Date());

export function haceDias(dias: number): string {
  const d = new Date();
  
  d.setDate(d.getDate() - dias);
  return aIso(d);
}

export function rangoSemana(referencia: string): { desde: string; hasta: string } {
  const d = leer(referencia);

  const lunes = new Date(d);
  lunes.setDate(d.getDate() - ((d.getDay() + 6) % 7));

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);

  return { desde: aIso(lunes), hasta: aIso(domingo) };
}

export function rangoMes(referencia: string): { desde: string; hasta: string } {
  const d = leer(referencia);
  return {
    desde: aIso(new Date(d.getFullYear(), d.getMonth(), 1)),
    hasta: aIso(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
  };
}