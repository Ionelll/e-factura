import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { transition, trigger, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.2s ease-in', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.2s ease-out', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  currentRoute: string;
  constructor(private router: Router) {
    this.router.events.subscribe((res) => {
      if (res instanceof NavigationEnd) this.currentRoute = res.url;
    });
  }
}
