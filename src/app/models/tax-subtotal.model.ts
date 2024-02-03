export interface TaxSubtotal {
  TaxSubtotal: {
    TaxableAmount: string;
    TaxCategory: {
      ID: string;
      Percent: string;
      TaxScheme: {
        ID: string;
      };
    };
  };
}
