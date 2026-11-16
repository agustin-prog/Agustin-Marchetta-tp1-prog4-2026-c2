import { Component, input, output } from '@angular/core';
import { ButacaModel } from '../butaca.model';

@Component({
  selector: 'app-grid-butacas',
  standalone: true,
  templateUrl: './grid-butacas.html',
  styleUrl: './grid-butacas.css',
})
export class GridButacas {
  matriz = input.required<ButacaModel[][][]>();
  estaOcupada = input<(butaca: ButacaModel) => boolean>(() => false);
  estaSeleccionada = input<(butaca: ButacaModel) => boolean>(() => false);

  elegirButaca = output<ButacaModel>();
}