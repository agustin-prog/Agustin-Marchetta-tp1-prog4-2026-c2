import { jsPDF } from 'jspdf';
import { toDataURL } from 'qrcode';

export interface ComprobanteDatos {
  qr: string;
  pelicula?: string;
  sala?: string;
  fechaHora?: string;          // ISO
  formato?: string;
  idioma?: string;
  butacas?: string[];
  candy?: string[];
  total?: number;
  restriccion?: string;        // 'ninguna' | '+13' | '+18'
}

export async function descargarComprobante(d: ComprobanteDatos): Promise<void> {
  const imagenQr = await toDataURL(d.qr, { width: 300, margin: 1 });
  const pdf = new jsPDF();

  pdf.setFontSize(22);
  pdf.text('Comprobante de compra', 105, 25, { align: 'center' });

  pdf.setFontSize(12);
  let y = 40;

  const linea = (texto: string) => {
    const partes = pdf.splitTextToSize(texto, 170) as string[];
    pdf.text(partes, 20, y);
    y += partes.length * 7 + 1;
  };

  if (d.pelicula) linea(`Película: ${d.pelicula}`);
  if (d.sala) linea(`Sala: ${d.sala}`);
  if (d.fechaHora) {
    linea(`Función: ${new Date(d.fechaHora).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })} hs`);
  }
  if (d.formato || d.idioma) linea(`Formato: ${d.formato ?? ''} - ${d.idioma ?? ''}`);
  if (d.butacas?.length) linea(`Butacas: ${d.butacas.join(', ')}`);
  if (d.candy?.length) linea(`Candy: ${d.candy.join(', ')}`);
  if (d.total !== undefined) linea(`Total pagado: $${d.total.toLocaleString('es-AR')}`);
  if (d.restriccion && d.restriccion !== 'ninguna') {
    linea(`Restricción de edad ${d.restriccion}: el espectador debe asistir acompañado por un adulto cuando corresponda.`);
  }

  y += 4;
  pdf.addImage(imagenQr, 'PNG', 55, y, 100, 100);
  y += 108;

  pdf.setFontSize(10);
  pdf.text(d.qr, 105, y, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text('Presentá este código al ingresar al cine.', 105, y + 12, { align: 'center' });

  pdf.save('comprobante-cine.pdf');
}