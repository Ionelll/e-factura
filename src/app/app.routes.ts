import { Routes } from '@angular/router';
import { InvoicePageComponent } from './pages/invoice-page/invoice-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { HelpComponent } from './pages/help/help.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: 'invoice', component: InvoicePageComponent },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'help', component: HelpComponent },
  { path: 'contact', component: ContactComponent },
  {path:'register',component:RegisterComponent},
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: 'invoice' },
];
