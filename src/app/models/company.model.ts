import { Adress } from './adress.model';

export interface Company {
  _id?: string;
  Party?: {
    PartyName: { Name: string };
    PostalAdress: Adress;
    PartyTaxScheme: {
      CompanyID: string;
      TaxScheme: { ID: string };
    };
    PartyLegalEntity: {
      RegistrationName: string;
      CompanyLegalForm: string;
    };
    Contact: {
      Name: string | null;
      Telephone: string | null;
      ElectronicMail: string | null;
    };
  };
}
