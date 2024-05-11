import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdressService } from '../../../services/adress.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authentication.service';
import { CurrencySymbolMap } from '../../../models/currencies.constant';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-my-company',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-company.component.html',
  styleUrl: './my-company.component.scss',
})
export class MyCompanyComponent implements OnInit {
  constructor(
    private adressService: AdressService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}
  activeImage: string;
  file: File;
  currencyList = CurrencySymbolMap;

  public Company = new FormGroup({
    Party: new FormGroup({
      PartyName: new FormGroup({
        Name: new FormControl('', Validators.required),
      }),
      PartyTaxScheme: new FormGroup({
        CompanyID: new FormControl('', Validators.required),
        TaxScheme: new FormGroup({
          ID: new FormControl('VAT', Validators.required),
        }),
      }),
      PartyLegalEntity: new FormGroup({
        RegistrationName: new FormControl('', Validators.required),
        CompanyLegalForm: new FormControl('', Validators.required),
      }),
      PostalAdress: new FormGroup({
        PostBox: new FormControl(''),
        StreetName: new FormControl('', Validators.required),
        BuildingNumber: new FormControl(''),
        CityName: new FormControl('', Validators.required),
        PostalZone: new FormControl(''),
        CountrySubentity: new FormControl(''),
        Country: new FormGroup({
          IdentificationCode: new FormControl('', Validators.required),
        }),
      }),
      Contact: new FormGroup({
        Name: new FormControl(''),
        Telephone: new FormControl(''),
        ElectronicMail: new FormControl(''),
      }),
    }),
    PayeeFinancialAccount: new FormGroup({
      ID: new FormControl('', Validators.required),
      CurrencyCode: new FormControl(''),
      FinancialInstitution: new FormGroup({
        ID: new FormControl('', Validators.required),
        Name: new FormControl(''),
      }),
    }),
    Logo: new FormControl(),
  });

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      if (res && res.Party) {
        console.log(res.Party);
        this.Company.patchValue(res);
        this.activeImage = res.Logo;
      }
    });
    this.adressService.subscribeCloseModal().subscribe((res) => {
      if (res.id == 'Company')
        this.Company.controls.Party.controls.PostalAdress.patchValue(
          res.PostalAdress
        );
    });
  }
  openModal() {
    this.adressService.openModal(
      'Supplier',
      this.Company.controls.Party.controls.PostalAdress.getRawValue()
    );
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
      this.Company.controls.Logo.setValue(this.file);
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.activeImage = reader.result as string;
      };
    }
  }
  save() {
    let company = new FormData();
    this.Company.controls.Party.controls.PartyLegalEntity.controls.RegistrationName.setValue(
      this.Company.controls.Party.controls.PartyName.controls.Name.value
    );
    console.log(this.Company.value);
    if (this.Company.controls.Party.valid) {
      console.log('hi');
      if (this.file) company.append('Logo', this.file);
      company.append('Party', JSON.stringify(this.Company.value));

      this.apiService.updateCompany(company);
    }
  }
}
