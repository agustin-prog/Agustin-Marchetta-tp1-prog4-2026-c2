import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-promociones-nav-admin',
  styleUrl: './promociones-nav-admin.css',
  templateUrl: './promociones-nav-admin.html',
})
export class PromocionesNavAdmin {}
