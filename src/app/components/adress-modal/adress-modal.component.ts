import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterRenderPhase,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { AdressService } from '../../services/adress.service';
import { environment } from '../../../../environment';
import { roSubdivisionMap } from '../../models/ro-subdivision.model';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { afterNextRender } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-adress-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './adress-modal.component.html',
  styleUrl: './adress-modal.component.scss',
})
export class AdressModalComponent {
  @ViewChild('search') search: ElementRef;
  public autocomplete: google.maps.places.Autocomplete;
  constructor(private adressService: AdressService, private _ngZone: NgZone) {
    afterNextRender(
      () => {
        this._ngZone.runOutsideAngular(() => {
          const loader = new Loader({
            apiKey: environment.placesKey,
            version: 'weekly',
            libraries: ['places'],
          });

          loader.importLibrary('places').then((google) => {
            this.autocomplete = new google.Autocomplete(
              this.search.nativeElement,
              {
                fields: ['address_components'],
                types: ['address'],
              }
            );
            this.autocomplete.addListener('place_changed', () => {
              const location = this.autocomplete.getPlace().address_components;

              location?.forEach((item) => {
                switch (item.types[0]) {
                  case 'street_number':
                    this.PostalAdress.controls.BuildingNumber.setValue(
                      item.long_name
                    );
                    break;
                  case 'locality':
                    this.PostalAdress.controls.CityName.setValue(
                      item.long_name
                    );
                    break;
                  case 'administrative_area_level_1':
                    this.PostalAdress.controls.CountrySubentity.setValue(
                      item.long_name
                    );
                    break;
                  case 'route':
                    this.PostalAdress.controls.StreetName.setValue(
                      item.long_name
                    );
                    break;
                  case 'country':
                    this.PostalAdress.controls.Country.controls.IdentificationCode.setValue(
                      item.short_name
                    );
                    break;
                  case 'postal_code':
                    this.PostalAdress.controls.PostalZone.setValue(
                      item.long_name
                    );
                }
              });
            });
          });
        });
      },
      { phase: AfterRenderPhase.Read }
    );
  }

  public subdivision = roSubdivisionMap;
  private openModalSub = new Subscription();

  PostalAdress = new FormGroup({
    PostBox: new FormControl(''),
    StreetName: new FormControl('', Validators.required),
    BuildingNumber: new FormControl(''),
    CityName: new FormControl('', Validators.required),
    PostalZone: new FormControl(''),
    CountrySubentity: new FormControl('', Validators.required),
    Country: new FormGroup({
      IdentificationCode: new FormControl('RO', Validators.required),
    }),
  });

  public id: string | null | undefined;

  ngOnInit(): void {
    this.openModalSub = this.adressService
      .subscribeOpenModal()
      .subscribe((res) => {
        this.id = res.id;
        this.PostalAdress.patchValue(res.PostalAdress);
      });
  }

  closeModal() {
    this.search.nativeElement.value = '';
    this.id = '';
    this.PostalAdress.reset();
    document
      .getElementsByClassName('pac-container')[0]
      .setAttribute('style', 'display:none');
  }
  outsideClick($event: Event) {
    const event = $event.target as Element;
    if (event.className == 'opened') {
      this.closeModal();
    }
  }
  returnForm() {
    if (this.PostalAdress.valid && this.id) {
      this.adressService.closeModal(this.id, this.PostalAdress.getRawValue());
      this.closeModal();
    } else return;
  }

  ngOnDestroy(): void {
    this.openModalSub.unsubscribe();
  }

  ngAfterViewInit(): void {}
}
