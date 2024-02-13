import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { TaxSubtotal } from '../models/tax-subtotal.model';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private emptyInvoice: Invoice = {
    Invoice: {
      InvoiceTypeCode: null,
      ID: null,
      IssueDate: null,
      InvoicePeriod: {
        StartDate: null,
        EndDate: null,
      },
      Note: null,
      DocumentCurrencyCode: null,
      OrderReference: { ID: null },
      ContractDocumentReference: { ID: null },
      AccountingSupplierParty: {
        Party: {
          PartyName: { Name: null },
          PartyLegalEntity: { RegistrationName: null, CompanyLegalForm: null },
          PartyTaxScheme: { CompanyID: null, TaxScheme: { ID: 'VAT' } },
          PostalAdress: {
            PostBox: null,
            StreetName: null,
            CityName: null,
            BuildingNumber: null,
            CountrySubentity: null,
            Country: { IdentificationCode: null },
            PostalZone: null,
          },
          Contact: {
            Name: null,
            ElectronicMail: null,
            Telephone: null,
          },
        },
      },
      AccountingCustomerParty: {
        Party: {
          PartyName: { Name: null },
          PartyLegalEntity: { RegistrationName: null, CompanyLegalForm: null },
          PartyTaxScheme: { CompanyID: null, TaxScheme: { ID: 'VAT' } },
          PostalAdress: {
            PostBox: null,
            StreetName: null,
            CityName: null,
            BuildingNumber: null,
            CountrySubentity: null,
            Country: { IdentificationCode: null },
            PostalZone: null,
          },
          Contact: {
            Name: null,
            ElectronicMail: null,
            Telephone: null,
          },
        },
      },
      Delivery: {
        ActualDeliveryDate: null,
        DeliveryLocation: {
          Adress: {
            PostBox: null,
            StreetName: null,
            CityName: null,
            BuildingNumber: null,
            CountrySubentity: null,
            Country: { IdentificationCode: null },
            PostalZone: null,
          },
        },
      },
      PaymentMeans: {
        PaymentCode: null,
        PaymentID: null,
        PayeeFinancialAccount: {
          ID: null,
        },
      },
      PaymentTerms: {
        Note: null,
      },
      TaxTotal: {
        TaxAmout: null,
        ApplyedTaxes: [],
      },
      LegalMonetaryTotal: {
        TaxExclusiveAmount: null,
        TaxInclusiveAmount: null,
        LineExtensionAmount: null,
        PayableAmount: null,
      },
      Lines: [],
    },
  };
  private invoice = new BehaviorSubject<Invoice>(this.emptyInvoice);
  private currency = new BehaviorSubject('RON');
  private VAT = new BehaviorSubject('');
  private netto = new BehaviorSubject('');
  private total = new BehaviorSubject('');
  getCurrency() {
    return this.currency.asObservable();
  }
  setCurrency(value: string) {
    if (value) {
      const x = this.invoice.value;
      x.Invoice.DocumentCurrencyCode = value;
      this.invoice.next(x);
      this.currency.next(value);
    }
  }
  getVat() {
    return this.VAT.asObservable();
  }
  setVat(value: string) {
    if (value.length > 0) {
      const x = this.invoice.value;
      x.Invoice.TaxTotal.TaxAmout = value;
      this.invoice.next(x);
      this.VAT.next(value);
    }
  }
  getNetto() {
    return this.netto.asObservable();
  }
  setNetto(value: string) {
    if (value && value.length > 0) {
      const x = this.invoice.value;
      x.Invoice.LegalMonetaryTotal.LineExtensionAmount = value;
      x.Invoice.LegalMonetaryTotal.TaxExclusiveAmount = value;
      this.invoice.next(x);
      this.netto.next(value);
    }
  }
  getTotal() {
    return this.total.asObservable();
  }
  setTotal(value: string) {
    if (value && value.length > 0) {
      const x = this.invoice.value;
      x.Invoice.LegalMonetaryTotal.PayableAmount = value;
      x.Invoice.LegalMonetaryTotal.TaxInclusiveAmount = value;
      this.total.next(value);
    }
  }
  setTaxSubtotal(tax: string, taxList: TaxSubtotal[]) {
    let preInvoice = this.invoice.value;
    preInvoice.Invoice.TaxTotal.TaxAmout = tax;
    preInvoice.Invoice.TaxTotal.ApplyedTaxes = taxList;
    this.invoice.next(preInvoice);
    console.log(this.invoice.value.Invoice);
  }
  setCustomer(value: Company['Party']) {
    const x = this.invoice.value;
    x.Invoice.AccountingCustomerParty.Party = value;
    this.invoice.next(x);
  }
  resetInvoice() {
    const x = this.emptyInvoice;
    x.Invoice.AccountingSupplierParty.Party =
      this.invoice.value.Invoice.AccountingSupplierParty.Party;
    x.Invoice.PaymentMeans = this.invoice.value.Invoice.PaymentMeans;
  }
}
