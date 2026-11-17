import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-estrellas',
  styleUrl: './estrellas.css',
  templateUrl: './estrellas.html',
})
export class Estrellas {

  valor = model(0);
  soloLectura = input(false);

  protected readonly numeros = [1, 2, 3, 4, 5];
  protected readonly llenas = computed(() => Math.round(this.valor()));

  protected elegir(n: number) {
    if (!this.soloLectura()) this.valor.set(n);
  }
}