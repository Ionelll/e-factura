export interface Bank {
  ID: string;
  CurrencyCode?: string;
  FinancialInstitution?: {
    Name?: string;
    ID?: string;
  };
}
