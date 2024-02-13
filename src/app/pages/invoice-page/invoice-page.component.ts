import { Component } from '@angular/core';
import { CustomerComponent } from '../../components/invoice-components/customer-form/customer.component';
import { InvoiceDetailsComponent } from '../../components/invoice-components/invoice-details/invoice-details.component';
import { InvoiceItemsComponent } from '../../components/invoice-components/invoice-items/invoice-items.component';
import { InvoiceActionsComponent } from '../../components/invoice-components/invoice-actions/invoice-actions.component';
import { InvoiceNotesComponent } from '../../components/invoice-components/invoice-notes/invoice-notes.component';

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [
    CustomerComponent,
    InvoiceNotesComponent,
    InvoiceDetailsComponent,
    InvoiceItemsComponent,
    InvoiceActionsComponent,
  ],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.scss',
})
export class InvoicePageComponent {}
