import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-confirmacion',
  styleUrl: './confirmacion.css',
  templateUrl: './confirmacion.html',
})
export class Confirmacion {
  qr = input.required<string>();
}
