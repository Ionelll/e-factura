import { Adress } from './adress.model';
import { Bank } from './bank.model';
import { Company } from './company.model';
import { invoiceLine } from './invoiceLine.model';
import { TaxSubtotal } from './tax-subtotal.model';

export interface Invoice {
  _id?: string | null;
  Invoice: {
    InvoiceTypeCode: string | null;
    ID: string | null;
    IssueDate: string | null;
    InvoicePeriod: {
      StartDate: string | null;
      EndDate: string | null;
    };
    Note: string | null;
    DocumentCurrencyCode: string | null;
    OrderReference?: { ID: string | null };
    ContractDocumentReference?: { ID: string | null };
    AccountingSupplierParty: Company;
    AccountingCustomerParty: Company;
    Delivery?: {
      ActualDeliveryDate: string | null;
      DeliveryLocation: {
        Adress: Adress;
      };
    };
    PaymentMeans: {
      PaymentCode: string | null;
      PaymentID: string | null;
      PayeeFinancialAccount: Bank;
    };
    PaymentTerms: {
      Note: string | null;
    };
    TaxTotal: {
      TaxAmout: string | null;
      ApplyedTaxes: TaxSubtotal[];
    };
    LegalMonetaryTotal: {
      TaxExclusiveAmount: string | null;
      TaxInclusiveAmount: string | null;
      LineExtensionAmount: string | null;
      PayableAmount: string | null;
    };
    Lines: invoiceLine[];
  };
}
