export interface invoiceSettings {
  duePeriod: number;
  DocumentCurrencyCode: string;
  introduction: string;
  Note: string;
  PaymentTerms: { Note: string };
}
