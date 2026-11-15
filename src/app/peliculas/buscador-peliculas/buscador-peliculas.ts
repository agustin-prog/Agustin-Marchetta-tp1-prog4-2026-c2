import { Component, input, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-buscador-peliculas',
  styleUrl: './buscador-peliculas.css',
  templateUrl: './buscador-peliculas.html',
})
export class BuscadorPeliculas {

  texto = model('');
  placeholder = input('Buscar...');
}