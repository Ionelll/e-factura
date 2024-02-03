import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Currency } from '../../../models/currency.model';
import { UnitSymbolMap } from '../../../models/units.model';
import { Item } from '../../../models/item.model';
import { Observable, startWith, map } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { InvoiceTotalsComponent } from '../invoice-totals/invoice-totals.component';

@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MatAutocomplete,
    MatOption,
    CommonModule,
    InvoiceTotalsComponent,
  ],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.scss',
})
export class InvoiceItemsComponent {
  Lines = new FormGroup({
    array: new FormArray([
      new FormGroup({
        InvoicedQuantity: new FormControl('', Validators.required),
        LineExtensionAmount: new FormControl(),
        Item: new FormGroup({
          Name: new FormControl('', Validators.required),
          ClassifiedTaxCategory: new FormGroup({
            ID: new FormControl('S'),
            Percent: new FormControl('0', Validators.required),
            TaxScheme: new FormGroup({
              ID: new FormControl(''),
            }),
          }),
        }),
        Price: new FormGroup({
          PriceAmount: new FormControl('', Validators.required),
          BaseQuantity: new FormControl(''),
          UnitCode: new FormControl('', Validators.required),
        }),
      }),
    ]),
  });
  units = UnitSymbolMap;
  articleOptions: Item[];
  filteredOptions: Observable<Item[] | undefined>;
  disableAnimation = true;
  currency: Currency;

  addInput() {
    this.disableAnimation = false;
    this.Lines.controls.array.push(
      new FormGroup({
        InvoicedQuantity: new FormControl('', Validators.required),
        LineExtensionAmount: new FormControl(),
        Item: new FormGroup({
          Name: new FormControl('', Validators.required),
          ClassifiedTaxCategory: new FormGroup({
            ID: new FormControl('S'),
            Percent: new FormControl('0', Validators.required),
            TaxScheme: new FormGroup({
              ID: new FormControl('VAT'),
            }),
          }),
        }),
        Price: new FormGroup({
          PriceAmount: new FormControl('', Validators.required),
          BaseQuantity: new FormControl(''),
          UnitCode: new FormControl('', Validators.required),
        }),
      })
    );
    // this.manageAutocompleteInArray(this.Lines.controls.array.length - 1);
  }

  removeInput(index: number) {
    this.disableAnimation = false;
    if (this.Lines.controls.array.length > 1) {
      this.Lines.controls.array.removeAt(index);
    } else {
      this.Lines.reset();
      localStorage.removeItem('LinesValues');
    }
  }

  autofillRow(value: string, i: number) {
    let selected = this.articleOptions?.find((item) => item.Item.Name == value);
    if (selected) {
      this.Lines.controls.array.controls[i].controls.Item.patchValue(
        selected.Item
      );
      this.Lines.controls.array.controls[i].controls.Price.patchValue(
        selected.Price
      );
    }
  }
  manageAutocompleteInArray(i: number) {
    if (this.filteredOptions)
      this.filteredOptions =
        this.Lines.controls.array.controls[
          i
        ].controls.Item.controls.Name.valueChanges.pipe(
          startWith(''),
          map((value: string | null) => {
            if (value != null) return this._filter2(value);
            else return undefined;
          })
        ) || [];
  }
  private _filter2(value: string): Item[] {
    const filterValue = value;
    return this.articleOptions?.filter((option) =>
      option.Item.Name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }
}
