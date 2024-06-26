import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environment';
import { Company } from '../models/company.model';
import { AuthService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private customerList = new Subject<string[]>();
  public customer = new Subject<Company>();

  setCustomerNamesList(value: string) {
    console.log('hi');
    this.http
      .get<string[]>(`${environment.api_url}/searchcustomer/${value}`)
      .subscribe((res) => {
        console.log(res);
        this.customerList.next(res);
      });
  }
  getCustomerNamesList() {
    return this.customerList.asObservable();
  }

  setCustomer(value: string) {
    this.http
      .get<Company>(`${environment.api_url}/returncustomer/${value}`)
      .subscribe((res) => {
        this.customer.next(res);
      });
  }
  getCustomer() {
    return this.customer.asObservable();
  }
  updateCompany(company: FormData) {
    console.log('hi');
    this.http
      .post<{ user: User; message: string }>(
        `${environment.api_url}/updatecompany`,
        company
      )
      .subscribe((res) => {
        this.authService.setUser(res.user);
      });
  }
}
