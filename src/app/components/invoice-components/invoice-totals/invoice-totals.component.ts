import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-totals',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './invoice-totals.component.html',
  styleUrl: './invoice-totals.component.scss',
})
export class InvoiceTotalsComponent implements OnInit {
  constructor(private invoiceService: InvoiceService) {}
  public netto = '';
  public total = '';
  public vat = '';
  public currency: string;
  ngOnInit(): void {
    this.invoiceService.getCurrency().subscribe((res) => {
      this.currency = res;
    });
    this.invoiceService.getVat().subscribe((res) => {
      if (!isNaN(parseFloat(res))) this.vat = res;
      else this.vat = '0.00';
    });
    this.invoiceService.getNetto().subscribe((res) => {
      if (!isNaN(parseFloat(res))) this.netto = res;
      else this.netto = '0.00';
    });
    this.invoiceService.getTotal().subscribe((res) => {
      if (!isNaN(parseFloat(res))) this.total = res;
      else this.total = '0.00';
    });
  }
}
