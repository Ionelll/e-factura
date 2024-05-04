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
        this.Company.reset();
        this.Company.patchValue(res);
      }
    });
  }
  openModal() {
    this.adressService.openModal(
      'Company',
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
    if (this.file) company.append('Logo', this.file);
    company.append('Party', JSON.stringify(this.Company.controls.Party.value));
    if (this.Company.valid) this.apiService.updateCompany(company);
  }
}
