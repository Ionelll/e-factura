import { Company } from './company.model';
import { Item } from './item.model';
import { Bank } from './bank.model';
import { invoiceSettings } from './invoiceSettings.model';

export interface User {
  email?: string;
  password?: string;
  role?: string;
  Party?: Company['Party'];
  PayeeFinancialAccount?: Bank;
  preferedLanguage?: string;
  Items?: Item[];
  lastInvoiceNr?: string;
  Logo?: any;
  invoiceSettings?: invoiceSettings;
}
