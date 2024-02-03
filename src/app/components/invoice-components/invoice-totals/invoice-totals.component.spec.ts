import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTotalsComponent } from './invoice-totals.component';

describe('InvoiceTotalsComponent', () => {
  let component: InvoiceTotalsComponent;
  let fixture: ComponentFixture<InvoiceTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceTotalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
