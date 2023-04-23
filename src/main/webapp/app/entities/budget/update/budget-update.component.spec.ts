import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BudgetFormService } from './budget-form.service';
import { BudgetService } from '../service/budget.service';
import { IBudget } from '../budget.model';

import { BudgetUpdateComponent } from './budget-update.component';

describe('Budget Management Update Component', () => {
  let comp: BudgetUpdateComponent;
  let fixture: ComponentFixture<BudgetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let budgetFormService: BudgetFormService;
  let budgetService: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BudgetUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BudgetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BudgetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    budgetFormService = TestBed.inject(BudgetFormService);
    budgetService = TestBed.inject(BudgetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const budget: IBudget = { id: 456 };

      activatedRoute.data = of({ budget });
      comp.ngOnInit();

      expect(comp.budget).toEqual(budget);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBudget>>();
      const budget = { id: 123 };
      jest.spyOn(budgetFormService, 'getBudget').mockReturnValue(budget);
      jest.spyOn(budgetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ budget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: budget }));
      saveSubject.complete();

      // THEN
      expect(budgetFormService.getBudget).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(budgetService.update).toHaveBeenCalledWith(expect.objectContaining(budget));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBudget>>();
      const budget = { id: 123 };
      jest.spyOn(budgetFormService, 'getBudget').mockReturnValue({ id: null });
      jest.spyOn(budgetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ budget: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: budget }));
      saveSubject.complete();

      // THEN
      expect(budgetFormService.getBudget).toHaveBeenCalled();
      expect(budgetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBudget>>();
      const budget = { id: 123 };
      jest.spyOn(budgetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ budget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(budgetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
