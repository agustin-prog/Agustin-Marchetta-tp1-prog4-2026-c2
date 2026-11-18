import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-candy-nav-admin',
  styleUrl: './candy-nav-admin.css',
  templateUrl: './candy-nav-admin.html',
})
export class CandyNavAdmin {}
