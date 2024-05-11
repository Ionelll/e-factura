import { Component } from '@angular/core';
import { CustomerComponent } from '../../components/invoice-components/customer-form/customer.component';
import { InvoiceDetailsComponent } from '../../components/invoice-components/invoice-details/invoice-details.component';
import { InvoiceItemsComponent } from '../../components/invoice-components/invoice-items/invoice-items.component';
import { InvoiceActionsComponent } from '../../components/invoice-components/invoice-actions/invoice-actions.component';
import { InvoiceNotesComponent } from '../../components/invoice-components/invoice-notes/invoice-notes.component';
import { CustomerSearchComponent } from '../../components/invoice-components/customer-search/customer-search.component';
import { InvoiceDeliveryComponent } from '../../components/invoice-delivery/invoice-delivery.component';

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [
    CustomerComponent,
    InvoiceNotesComponent,
    InvoiceDetailsComponent,
    InvoiceItemsComponent,
    InvoiceActionsComponent,
    CustomerSearchComponent,
    InvoiceDeliveryComponent,
  ],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.scss',
})
export class InvoicePageComponent {}
