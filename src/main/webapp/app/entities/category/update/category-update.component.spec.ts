import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CategoryFormService } from './category-form.service';
import { CategoryService } from '../service/category.service';
import { ICategory } from '../category.model';
import { IBudget } from 'app/entities/budget/budget.model';
import { BudgetService } from 'app/entities/budget/service/budget.service';

import { CategoryUpdateComponent } from './category-update.component';

describe('Category Management Update Component', () => {
  let comp: CategoryUpdateComponent;
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categoryFormService: CategoryFormService;
  let categoryService: CategoryService;
  let budgetService: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CategoryUpdateComponent],
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
      .overrideTemplate(CategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categoryFormService = TestBed.inject(CategoryFormService);
    categoryService = TestBed.inject(CategoryService);
    budgetService = TestBed.inject(BudgetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Budget query and add missing value', () => {
      const category: ICategory = { id: 456 };
      const budget: IBudget = { id: 33553 };
      category.budget = budget;
      const budget: IBudget = { id: 63641 };
      category.budget = budget;

      const budgetCollection: IBudget[] = [{ id: 37003 }];
      jest.spyOn(budgetService, 'query').mockReturnValue(of(new HttpResponse({ body: budgetCollection })));
      const additionalBudgets = [budget, budget];
      const expectedCollection: IBudget[] = [...additionalBudgets, ...budgetCollection];
      jest.spyOn(budgetService, 'addBudgetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(budgetService.query).toHaveBeenCalled();
      expect(budgetService.addBudgetToCollectionIfMissing).toHaveBeenCalledWith(
        budgetCollection,
        ...additionalBudgets.map(expect.objectContaining)
      );
      expect(comp.budgetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const category: ICategory = { id: 456 };
      const budget: IBudget = { id: 51857 };
      category.budget = budget;
      const budget: IBudget = { id: 24574 };
      category.budget = budget;

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(comp.budgetsSharedCollection).toContain(budget);
      expect(comp.budgetsSharedCollection).toContain(budget);
      expect(comp.category).toEqual(category);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICategory>>();
      const category = { id: 123 };
      jest.spyOn(categoryFormService, 'getCategory').mockReturnValue(category);
      jest.spyOn(categoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: category }));
      saveSubject.complete();

      // THEN
      expect(categoryFormService.getCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(categoryService.update).toHaveBeenCalledWith(expect.objectContaining(category));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICategory>>();
      const category = { id: 123 };
      jest.spyOn(categoryFormService, 'getCategory').mockReturnValue({ id: null });
      jest.spyOn(categoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ category: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: category }));
      saveSubject.complete();

      // THEN
      expect(categoryFormService.getCategory).toHaveBeenCalled();
      expect(categoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICategory>>();
      const category = { id: 123 };
      jest.spyOn(categoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(categoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBudget', () => {
      it('Should forward to budgetService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(budgetService, 'compareBudget');
        comp.compareBudget(entity, entity2);
        expect(budgetService.compareBudget).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
