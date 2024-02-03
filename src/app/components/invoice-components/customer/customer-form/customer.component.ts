import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerSearchComponent } from '../customer-search/customer-search.component';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  state,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { Company } from '../../../../models/company.model';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CustomerSearchComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
  animations: [
    trigger('grow', [
      state('true', style({ height: '25rem' })),
      state('false', style({ height: '6rem' })),
      transition('false <=> true', [
        group([
          animate('0.3s ease'),

          query(
            ':enter,:leave',
            [
              style({
                position: 'absolute',
                width: '100%',
                top: 0,
              }),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({ opacity: 0 }),
              animate('0.3s ease', style({ opacity: 1 })),
            ],
            { optional: true }
          ),
          query(':leave', [animate('0.3s ease', style({ opacity: 0 }))], {
            optional: true,
          }),
        ]),
      ]),
    ]),
  ],
})
export class CustomerComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService) {}

  public Customer = new FormGroup({
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
      Postbox: new FormControl(''),
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
  public status = false;
  public recieved = false;
  private customerSub = new Subscription();

  ngOnInit(): void {
    this.customerSub = this.apiService.getCustomer().subscribe((res) => {
      if (res?.Party) {
        this.Customer.setValue(res.Party);
        this.Customer.controls.PartyLegalEntity.controls.RegistrationName.setValue(
          res.Party.PartyName.Name
        );
        console.log(this.Customer.value);
        this.recieved = true;
      }
    });
  }
  ngOnDestroy(): void {
    this.customerSub.unsubscribe();
  }
}
