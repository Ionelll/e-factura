import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { InvoiceService } from '../../../services/invoice.service';
import { debounceTime } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { TaxSubtotal } from '../../../models/tax-subtotal.model';

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
export class InvoiceItemsComponent implements OnInit {
  constructor(
    private invoiceService: InvoiceService,
    private currencyPipe: CurrencyPipe,
    private cd: ChangeDetectorRef
  ) {}

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
              ID: new FormControl('VAT'),
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
  currentCurrency: string;

  ngOnInit(): void {
    this.invoiceService.getCurrency().subscribe((res) => {
      this.currentCurrency = res;
    });
    this.Lines.controls.array.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.calculateTotals();
      });
  }
  calculateTotals() {
    let totalNoVat = 0;
    let totalWithVat = 0;
    let taxSubtotals: TaxSubtotal[] = [];

    this.Lines.controls.array.controls.forEach((InvoiceLine) => {
      totalNoVat +=
        parseFloat(InvoiceLine.controls.InvoicedQuantity.value as string) *
        parseFloat(
          InvoiceLine.controls.Price.controls.PriceAmount.value as string
        );
      totalWithVat +=
        parseFloat(InvoiceLine.controls.InvoicedQuantity.value as string) *
        parseFloat(
          InvoiceLine.controls.Price.controls.PriceAmount.value as string
        ) *
        (1 +
          parseFloat(
            InvoiceLine.controls.Item.controls.ClassifiedTaxCategory.controls
              .Percent.value as string
          ) /
            100);

      let SameTaxCategory_index = taxSubtotals.findIndex(
        (element) =>
          element.TaxSubtotal.TaxCategory.ID ===
            InvoiceLine.controls.Item.controls.ClassifiedTaxCategory.controls.ID
              .value &&
          element.TaxSubtotal.TaxCategory.Percent ===
            InvoiceLine.controls.Item.controls.ClassifiedTaxCategory.controls
              .Percent.value
      );

      if (SameTaxCategory_index >= 0) {
        taxSubtotals[SameTaxCategory_index].TaxSubtotal.TaxableAmount = (
          parseFloat(
            taxSubtotals[SameTaxCategory_index].TaxSubtotal
              .TaxableAmount as string
          ) +
          parseFloat(InvoiceLine.controls.InvoicedQuantity.value as string) *
            parseFloat(
              InvoiceLine.controls.Price.controls.PriceAmount.value as string
            )
        ).toFixed(2);
      } else {
        taxSubtotals.push({
          TaxSubtotal: {
            TaxableAmount: (
              parseFloat(
                InvoiceLine.controls.InvoicedQuantity.value as string
              ) *
              parseFloat(
                InvoiceLine.controls.Price.controls.PriceAmount.value as string
              )
            ).toFixed(2),
            TaxCategory:
              InvoiceLine.controls.Item.controls.ClassifiedTaxCategory.getRawValue(),
          },
        });
      }
    });
    this.invoiceService.setTaxSubtotal(
      (totalWithVat - totalNoVat).toFixed(2),
      taxSubtotals
    );
    this.invoiceService.setTotal(totalWithVat.toFixed(2) || '0');
    this.invoiceService.setNetto(totalNoVat.toFixed(2) || '0');
    this.invoiceService.setVat((totalWithVat - totalNoVat).toFixed(2) || '0');
  }

  lineTotal(i: number) {
    const line = this.Lines.controls.array.controls[i].controls;
    if (line.Price.controls.PriceAmount.value && line.InvoicedQuantity.value)
      return (
        parseFloat(line.InvoicedQuantity.value as string) *
        parseFloat(line.Price.controls.PriceAmount.value as string)
      ).toFixed(2);
    else return '0.00';
  }

  addInput() {
    this.disableAnimation = false;
    this.Lines.controls.array.push(
      new FormGroup({
        InvoicedQuantity: new FormControl('', Validators.required),
        LineExtensionAmount: new FormControl(),
        Item: new FormGroup({
          Name: new FormControl('', Validators.required),
          ClassifiedTaxCategory: new FormGroup({
            ID: new FormControl('S', Validators.required),
            Percent: new FormControl('0', Validators.required),
            TaxScheme: new FormGroup({
              ID: new FormControl('VAT', Validators.required),
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
