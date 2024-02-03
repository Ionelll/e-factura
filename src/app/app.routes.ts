import { Routes } from '@angular/router';
import { InvoicePageComponent } from './pages/invoice-page/invoice-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { HelpComponent } from './pages/help/help.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: 'invoice', component: InvoicePageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'help', component: HelpComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'invoice' },
];
