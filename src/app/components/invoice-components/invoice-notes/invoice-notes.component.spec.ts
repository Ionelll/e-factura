import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNotesComponent } from './invoice-notes.component';

describe('InvoiceNotesComponent', () => {
  let component: InvoiceNotesComponent;
  let fixture: ComponentFixture<InvoiceNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
