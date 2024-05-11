import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';

import { AdressModalComponent } from './components/adress-modal/adress-modal.component';
import { AuthService } from './services/authentication.service';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import {
  trigger,
  transition,
  query,
  style,
  group,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, AdressModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fade', [
      transition('*<=>*', [
        query(
          ':enter,:leave',
          [
            style({
              position: 'absolute',
              height: '100%',
              width: '100%',
            }),
          ],
          { optional: true }
        ),
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        group([
          query(':enter', [animate('0.3s 0.2s ease', style({ opacity: 1 }))], {
            optional: true,
          }),
          query(':leave', [animate('0.3s ease', style({ opacity: 0 }))], {
            optional: true,
          }),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private contexts: ChildrenOutletContexts
  ) {}
  title = 'e-factura';

  ngOnInit(): void {
    this.authService.setLoginStatus();
  }
  getAnimation() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
