import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Adress } from '../../models/adress.model';
import { Subscription } from 'rxjs';
import { AdressService } from '../../services/adress.service';

@Component({
  selector: 'app-invoice-delivery',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './invoice-delivery.component.html',
  styleUrl: './invoice-delivery.component.scss',
})
export class InvoiceDeliveryComponent implements OnInit, OnDestroy {
  constructor(private adressService: AdressService) {}
  public invoiceDelivery = new FormGroup({
    ActualDeliveryDate: new FormControl(''),
    DeliveryLocation: new FormGroup({
      Adress: new FormGroup({
        PostBox: new FormControl(''),
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
  public adress: Adress | undefined;
  private adressSub = new Subscription();
  ngOnInit(): void {
    this.adressSub = this.adressService
      .subscribeCloseModal()
      .subscribe((res) => {
        if (res.id === 'Delivery') {
          this.invoiceDelivery.controls.DeliveryLocation.controls.Adress.reset();
          this.invoiceDelivery.controls.DeliveryLocation.controls.Adress.patchValue(
            res.PostalAdress
          );
          this.adress = res.PostalAdress;
        }
      });
  }
  openModal() {
    console.log('hi');
    this.adressService.openModal(
      'Delivery',
      this.invoiceDelivery.controls.DeliveryLocation.controls.Adress.getRawValue()
    );
  }
  ngOnDestroy(): void {
    this.adressSub.unsubscribe();
  }
}
