import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinancialAccountDetailComponent } from './financial-account-detail.component';

describe('FinancialAccount Management Detail Component', () => {
  let comp: FinancialAccountDetailComponent;
  let fixture: ComponentFixture<FinancialAccountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialAccountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ financialAccount: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinancialAccountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinancialAccountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load financialAccount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.financialAccount).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
