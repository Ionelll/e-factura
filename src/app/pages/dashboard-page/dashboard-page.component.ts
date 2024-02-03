import { Component } from '@angular/core';
import { AccountSettingsComponent } from '../../components/dashboard-components/account-settings/account-settings.component';
import { InvoiceSettingsComponent } from '../../components/dashboard-components/invoice-settings/invoice-settings.component';
import { MyCompanyComponent } from '../../components/dashboard-components/my-company/my-company.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MyCompanyComponent,
    AccountSettingsComponent,
    InvoiceSettingsComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {}
