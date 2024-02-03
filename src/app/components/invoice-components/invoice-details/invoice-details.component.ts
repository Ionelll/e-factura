import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { CurrencySymbolMap } from '../../../models/currencies.constant';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  group,
  animate,
  query,
} from '@angular/animations';
import { Adress } from '../../../models/adress.model';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TextFieldModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
  animations: [
    trigger('grow', [
      state('true', style({ height: '32rem' })),
      state('false', style({ height: '6rem' })),
      transition('false <=> true', [
        group([
          animate('0.3s ease'),

          query(
            ':enter,:leave',
            [style({ position: 'absolute', width: '100%', top: 0 })],
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
export class InvoiceDetailsComponent implements OnInit {
  public duePeriod = 30;
  public currencies = CurrencySymbolMap;
  private startDateSub = new Subscription();
  public adress: Adress;
  public status = false;
  public invoiceDetails = new FormGroup({
    ID: new FormControl('', Validators.required),
    IssueDate: new FormControl(
      new Date().toISOString().split('T')[0],
      Validators.required
    ),
    InvoicePeriod: new FormGroup({
      StartDate: new FormControl(
        new Date().toISOString().split('T')[0],
        Validators.required
      ),
      EndDate: new FormControl(
        new Date(new Date().setDate(new Date().getDate() + 30))
          .toISOString()
          .split('T')[0],

        Validators.required
      ),
    }),
    InvoiceTypeCode: new FormControl('380', Validators.required),
    DocumentCurrencyCode: new FormControl('RON', Validators.required),
    OrderReference: new FormControl(''),
    ContractReference: new FormControl(''),
    ActualDeliveryDate: new FormControl(''),
    DeliveryLocation: new FormGroup({
      Adress: new FormGroup({
        Postbox: new FormControl(''),
        StreetName: new FormControl(''),
        BuildingNumber: new FormControl(''),
        CityName: new FormControl(''),
        PostalZone: new FormControl(''),
        CountrySubentity: new FormControl(''),
        Country: new FormGroup({
          IdentificationCode: new FormControl(''),
        }),
      }),
    }),
  });
  refreshDueDate() {
    if (this.invoiceDetails.controls.InvoicePeriod.controls.StartDate.value) {
      var date = new Date(
        this.invoiceDetails.controls.InvoicePeriod.controls.StartDate.value
      );
      const day = date.getDate();
      date.setDate(day + (this.duePeriod || 30));
      const formattedDate = date.toISOString().split('T')[0];
      this.invoiceDetails.controls.InvoicePeriod.controls.EndDate.setValue(
        formattedDate
      );
    }
  }
  ngOnInit(): void {
    this.startDateSub =
      this.invoiceDetails.controls.InvoicePeriod.controls.StartDate.valueChanges.subscribe(
        (res) => {
          if (res) {
            console.log(res);
            const newDate = new Date(res);
            newDate.setDate(newDate.getDate() + 30);
            const formattedDate = newDate.toISOString().split('T')[0];
            console.log(formattedDate);
            this.invoiceDetails.controls.InvoicePeriod.controls.EndDate.setValue(
              formattedDate
            );
          }
        }
      );
  }
}
