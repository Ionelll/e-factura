import { Item } from './item.model';
import { AllowanceCharge } from './allowanceCharge.model';

export interface invoiceLine {
  InvoiceLine: {
    InvoicedQuantity: string;
    LineExtensionAmount: string;
    AllowanceCherge: AllowanceCharge;
    Item: Item['Item'];
    Price: Item['Price'];
  };
}
