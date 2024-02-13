import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/navigation/toolbar/toolbar.component';
import { AdressModalComponent } from './components/adress-modal/adress-modal.component';
import { AuthService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, AdressModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  title = 'e-factura';

  ngOnInit(): void {
    this.authService.setLoginStatus();
  }
}
