export interface ColumnaReporte {
  titulo: string;
  tipo: 'texto' | 'entero' | 'moneda' | 'fecha';
}

export interface TablaReporte {
  titulo: string;
  columnas: ColumnaReporte[];
  filas: (string | number)[][];
  totales?: (string | number)[];
}

const formatoPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 2,
});

export const formatoMoneda = (n: number) => formatoPesos.format(n);

export function formatear(valor: string | number, tipo: ColumnaReporte['tipo']): string {
  switch (tipo) {
    case 'moneda': return formatoMoneda(Number(valor));
    case 'entero': return Number(valor).toLocaleString('es-AR');
    case 'fecha': {
      const [a, m, d] = String(valor).split('-');
      return a && m && d ? `${d}/${m}/${a}` : String(valor);
    }
    default: return String(valor);
  }
}

function filasConTotales(t: TablaReporte): (string | number)[][] {
  return t.totales ? [...t.filas, t.totales] : t.filas;
}

export async function descargarExcel(t: TablaReporte, nombreArchivo: string, periodo: string): Promise<void> {
  const XLSX = await import('xlsx');

  const filas = filasConTotales(t).map((fila) =>
    Object.fromEntries(t.columnas.map((c, i) => [
      c.titulo,
      c.tipo === 'fecha' ? formatear(fila[i], 'fecha') : fila[i],
    ])),
  );

  const hoja = XLSX.utils.json_to_sheet(filas);
  hoja['!cols'] = t.columnas.map(() => ({ wch: 22 }));
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, t.titulo.slice(0, 31));
  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
}

export async function descargarPdf(t: TablaReporte, nombreArchivo: string, periodo: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const margen = 14;
  const ancho = (210 - margen * 2) / t.columnas.length;
  let y = 20;

  const encabezado = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    t.columnas.forEach((c, i) => {
      const esNumero = c.tipo === 'entero' || c.tipo === 'moneda';
      doc.text(c.titulo, esNumero ? margen + ancho * (i + 1) - 2 : margen + ancho * i, y, esNumero ? { align: 'right' } : undefined);
    });
    doc.line(margen, y + 2, 210 - margen, y + 2);
    y += 8;
    doc.setFont('helvetica', 'normal');
  };

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(t.titulo, margen, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(periodo, margen, y);
  y += 10;

  encabezado();

  const todas = filasConTotales(t);
  todas.forEach((fila, f) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
      encabezado();
    }
    const esTotal = t.totales !== undefined && f === todas.length - 1;
    if (esTotal) doc.setFont('helvetica', 'bold');

    t.columnas.forEach((c, i) => {
      const texto = formatear(fila[i], c.tipo);
      const esNumero = c.tipo === 'entero' || c.tipo === 'moneda';
      if (esNumero) {
        doc.text(texto, margen + ancho * (i + 1) - 2, y, { align: 'right' });
      } else {
        doc.text(doc.splitTextToSize(texto, ancho - 4)[0] ?? '', margen + ancho * i, y);   // una línea por celda
      }
    });

    if (esTotal) doc.setFont('helvetica', 'normal');
    y += 7;
  });

  doc.save(`${nombreArchivo}.pdf`);
}