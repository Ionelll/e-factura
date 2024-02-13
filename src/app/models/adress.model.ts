export interface Adress {
  PostBox: string | null;
  StreetName: string | null;
  BuildingNumber: string | null;
  CityName: string | null;
  PostalZone: string | null;
  CountrySubentity: string | null;
  Country: { IdentificationCode: string | null };
}
