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

  private customerSub = new Subscription();
  public client: Company;
  ngOnInit(): void {
    this.customerSub = this.apiService
      .getCustomer()
      .subscribe((res: Company) => {
        if (res?.Party && res?._id) {
          this.client = res;
        }
      });
  }
  ngOnDestroy(): void {
    this.customerSub.unsubscribe();
  }

  // openModal() {
  //   this.adressService.openModal(
  //     'Customer',
  //     this.Customer.controls.PostalAdress.getRawValue()
  //   );
  // }
  // clearForm() {
  //   this.Customer.reset();
  // }
}
