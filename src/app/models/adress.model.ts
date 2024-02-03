export interface Adress {
  Postbox: string | null;
  StreetName: string;
  BuildingNumber: string | null;
  CityName: string;
  PostalZone: string | null;
  CountrySubentity: string | null;
  Country: { IdentificationCode: string };
}
