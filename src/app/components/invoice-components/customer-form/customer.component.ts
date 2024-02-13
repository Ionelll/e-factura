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
import { Company } from '../../../models/company.model';
import { ApiService } from '../../../services/api.service';
import { AdressService } from '../../../services/adress.service';
import { MyCompanyComponent } from '../../dashboard-components/my-company/my-company.component';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CustomerSearchComponent,
    ReactiveFormsModule,
    CommonModule,
    MyCompanyComponent,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
  animations: [
    trigger('grow', [
      state('true', style({ height: '24rem' })),
      state('false', style({ height: '6rem' })),
      transition('false <=> true', [
        group([
          animate('0.3s ease'),

          query(
            ':enter,:leave',
            [
              style({
                width: '100%',
                top: 0,
              }),
            ],
            { optional: true }
          ),
          query(':leave', [style({ position: 'absolute' })], {
            optional: true,
          }),
          query(
            ':enter',
            [
              style({ opacity: 0 }),
              animate('0.1s ease', style({ opacity: 1 })),
            ],
            { optional: true }
          ),
          query(':leave', [animate('0.1s ease', style({ opacity: 0 }))], {
            optional: true,
          }),
        ]),
      ]),
    ]),
  ],
})
export class CustomerComponent implements OnInit, OnDestroy {
  constructor(
    private apiService: ApiService,
    private adressService: AdressService,
    private invoiceService: InvoiceService
  ) {}

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
  public status = false;
  public recieved = false;
  private customerSub = new Subscription();
  private adressSub = new Subscription();
  private customerId: string;
  ngOnInit(): void {
    this.customerSub = this.apiService
      .getCustomer()
      .subscribe((res: Company) => {
        if (res?.Party && res?._id) {
          this.customerId = res?._id;
          this.Customer.reset();
          this.Customer.patchValue(res.Party);
          this.Customer.controls.PartyLegalEntity.controls.RegistrationName.setValue(
            res.Party.PartyName.Name
          );
          this.invoiceService.setCustomer(res.Party);
          this.recieved = true;
        }
      });
    this.adressSub = this.adressService
      .subscribeCloseModal()
      .subscribe((res) => {
        if (res.id === 'Customer') {
          this.Customer.controls.PostalAdress.reset();
          this.Customer.controls.PostalAdress.patchValue(res.PostalAdress);
        }
      });
  }
  ngOnDestroy(): void {
    this.customerSub.unsubscribe();
    this.adressSub.unsubscribe();
  }

  openModal() {
    this.adressService.openModal(
      'Customer',
      this.Customer.controls.PostalAdress.getRawValue()
    );
  }
  clearForm() {
    this.Customer.reset();
  }
}
