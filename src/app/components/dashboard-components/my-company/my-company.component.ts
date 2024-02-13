import { Component, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdressService } from '../../../services/adress.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authentication.service';
import { Company } from '../../../models/company.model';

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
    private authService: AuthService
  ) {}

  @Input() customer: Company['Party'];

  public Company = new FormGroup({
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
  });

  openModal() {
    this.adressService.openModal(
      'Customer',
      this.Company.controls.PostalAdress.getRawValue()
    );
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      if (res && res.Party) {
        this.Company.reset();
        this.Company.patchValue(res.Party);
      }
    });
  }
}
