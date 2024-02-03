import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.scss',
})
export class CustomerSearchComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService) {}
  public search = new FormGroup({
    input: new FormControl(''),
  });
  private customerListSub = new Subscription();
  public customerList: string[] = [];
  ngOnInit(): void {
    this.search.controls.input.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        console.log(value);
        if (value && value?.length >= 3)
          this.apiService.setCustomerNamesList(value);
      });
    this.customerListSub = this.apiService
      .getCustomerNamesList()
      .subscribe((res: string[]) => {
        this.customerList = res;
      });
  }
  ngOnDestroy(): void {
    this.customerListSub.unsubscribe();
  }

  setCustomer() {
    if (this.search.controls.input.value)
      this.apiService.setCustomer(this.search.controls.input.value);
    this.search.reset();
  }
}
