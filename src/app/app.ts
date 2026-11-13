import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  selector: 'app-navbar',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  
}