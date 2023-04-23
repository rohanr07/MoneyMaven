import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinancialTransactionDetailComponent } from './financial-transaction-detail.component';

describe('FinancialTransaction Management Detail Component', () => {
  let comp: FinancialTransactionDetailComponent;
  let fixture: ComponentFixture<FinancialTransactionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialTransactionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ financialTransaction: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinancialTransactionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinancialTransactionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load financialTransaction on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.financialTransaction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
