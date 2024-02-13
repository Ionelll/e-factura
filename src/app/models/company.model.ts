import { Adress } from './adress.model';

export interface Company {
  _id?: string;
  Party: {
    PartyName: { Name: string | null };
    PostalAdress: Adress;
    PartyTaxScheme: {
      CompanyID: string | null;
      TaxScheme: { ID: string | null };
    };
    PartyLegalEntity: {
      RegistrationName: string | null;
      CompanyLegalForm: string | null;
    };
    Contact: {
      Name: string | null;
      Telephone: string | null;
      ElectronicMail: string | null;
    };
  };
}
