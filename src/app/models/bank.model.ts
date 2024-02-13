export interface Bank {
  ID: string | null;
  CurrencyCode?: string | null;
  FinancialInstitution?: {
    Name?: string | null;
    ID?: string | null;
  };
}
