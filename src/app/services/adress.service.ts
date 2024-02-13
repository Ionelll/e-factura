import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Adress } from '../models/adress.model';

@Injectable({ providedIn: 'root' })
export class AdressService {
  private openModalEmmiter = new Subject<{
    id: string;
    PostalAdress: Adress;
  }>();
  private updated = new Subject<{ id: string; PostalAdress: Adress }>();

  openModal(id: string, PostalAdress: Adress) {
    this.openModalEmmiter.next({ id, PostalAdress });
  }

  subscribeOpenModal() {
    return this.openModalEmmiter.asObservable();
  }
  closeModal(id: string, PostalAdress: Adress) {
    this.updated.next({ id, PostalAdress });
  }
  subscribeCloseModal() {
    return this.updated.asObservable();
  }
}
