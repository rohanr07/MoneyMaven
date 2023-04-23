import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IncomeDetailComponent } from './income-detail.component';

describe('Income Management Detail Component', () => {
  let comp: IncomeDetailComponent;
  let fixture: ComponentFixture<IncomeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ income: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IncomeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IncomeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load income on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.income).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
