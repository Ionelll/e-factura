export interface Item {
  Item: {
    Name: string;
    ClassifiedTaxCategory: {
      ID: string;
      Percent: string;
      TaxScheme: {
        ID: string;
      };
    };
  };
  Price: {
    PriceAmount: string;
    BaseQuantity: string;
    UnitCode: string;
  };
}
