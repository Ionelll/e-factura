import { Component } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { InvoiceActionsComponent } from '../invoice-actions/invoice-actions.component';

@Component({
  selector: 'app-invoice-notes',
  standalone: true,
  imports: [TextFieldModule, InvoiceActionsComponent],
  templateUrl: './invoice-notes.component.html',
  styleUrl: './invoice-notes.component.scss',
})
export class InvoiceNotesComponent {}
