import { Component, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PeliculaStore } from '../pelicula.store';

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-pelicula-form',
  styleUrl: './pelicula-form.css',
  templateUrl: './pelicula-form.html',
})
export class PeliculaForm {

  private readonly store = inject(PeliculaStore);
  private readonly router = inject(Router);

  
};
