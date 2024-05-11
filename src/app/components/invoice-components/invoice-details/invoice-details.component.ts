import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
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
import { AdressService } from '../../../services/adress.service';
import { InvoiceService } from '../../../services/invoice.service';
import { MatFormField } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TextFieldModule,
    MatFormField,
    MatDatepickerModule,
    MatInputModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
  animations: [
    trigger('grow', [
      state('true', style({ height: '30rem' })),
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
  constructor(
    private adressService: AdressService,
    private invoiceService: InvoiceService
  ) {}

  public duePeriod = 30;
  public currencies = CurrencySymbolMap;
  private startDateSub = new Subscription();
  private adressSub = new Subscription();

  public status = false;
  public invoiceDetails = new FormGroup({
    ID: new FormControl('', Validators.required),
    IssueDate: new FormControl(new Date().toISOString().split('T')[0], [
      Validators.required,
    ]),
    InvoicePeriod: new FormGroup({
      StartDate: new FormControl(
        new Date().toISOString().split('T')[0],
        Validators.required
      ),
      EndDate: new FormControl(
        new Date(
          new Date().setDate(new Date().getDate() + this.duePeriod || 30)
        )
          .toISOString()
          .split('T')[0],

        Validators.required
      ),
    }),
    InvoiceTypeCode: new FormControl('380', Validators.required),
    DocumentCurrencyCode: new FormControl('RON', Validators.required),
    OrderReference: new FormControl(''),
    ContractReference: new FormControl(''),
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

  changeCurrency() {
    this.invoiceService.setCurrency(
      this.invoiceDetails.controls.DocumentCurrencyCode.getRawValue() || ''
    );
  }
  ngOnInit(): void {
    // this.startDateSub =
    //   this.invoiceDetails.controls.InvoicePeriod.controls.StartDate.valueChanges.subscribe(
    //     (res) => {
    //       if (res) {
    //         console.log(res);
    //         const newDate = new Date(res);
    //         newDate.setDate(newDate.getDate() + 30);
    //         const formattedDate = newDate.toISOString().split('T')[0];
    //         console.log(formattedDate);
    //         this.invoiceDetails.controls.InvoicePeriod.controls.EndDate.setValue(
    //           formattedDate
    //         );
    //       }
    //     }
    //   );
  }
}
