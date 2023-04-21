import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExpensesDetailComponent } from './expenses-detail.component';

describe('Expenses Management Detail Component', () => {
  let comp: ExpensesDetailComponent;
  let fixture: ComponentFixture<ExpensesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ expenses: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExpensesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExpensesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load expenses on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.expenses).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
