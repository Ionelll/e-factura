export interface TaxSubtotal {
  TaxSubtotal: {
    TaxableAmount: string | null;
    TaxCategory: {
      ID: string | null;
      Percent: string | null;
      TaxScheme: {
        ID: string | null;
      };
    };
  };
}
