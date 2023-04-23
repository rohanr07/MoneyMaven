import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinancialTransactionFormService } from './financial-transaction-form.service';
import { FinancialTransactionService } from '../service/financial-transaction.service';
import { IFinancialTransaction } from '../financial-transaction.model';
import { IFinancialAccount } from 'app/entities/financial-account/financial-account.model';
import { FinancialAccountService } from 'app/entities/financial-account/service/financial-account.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IBudget } from 'app/entities/budget/budget.model';
import { BudgetService } from 'app/entities/budget/service/budget.service';

import { FinancialTransactionUpdateComponent } from './financial-transaction-update.component';

describe('FinancialTransaction Management Update Component', () => {
  let comp: FinancialTransactionUpdateComponent;
  let fixture: ComponentFixture<FinancialTransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let financialTransactionFormService: FinancialTransactionFormService;
  let financialTransactionService: FinancialTransactionService;
  let financialAccountService: FinancialAccountService;
  let categoryService: CategoryService;
  let budgetService: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinancialTransactionUpdateComponent],
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
      .overrideTemplate(FinancialTransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinancialTransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    financialTransactionFormService = TestBed.inject(FinancialTransactionFormService);
    financialTransactionService = TestBed.inject(FinancialTransactionService);
    financialAccountService = TestBed.inject(FinancialAccountService);
    categoryService = TestBed.inject(CategoryService);
    budgetService = TestBed.inject(BudgetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FinancialAccount query and add missing value', () => {
      const financialTransaction: IFinancialTransaction = { id: 456 };
      const account: IFinancialAccount = { id: 83585 };
      financialTransaction.account = account;

      const financialAccountCollection: IFinancialAccount[] = [{ id: 80208 }];
      jest.spyOn(financialAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: financialAccountCollection })));
      const additionalFinancialAccounts = [account];
      const expectedCollection: IFinancialAccount[] = [...additionalFinancialAccounts, ...financialAccountCollection];
      jest.spyOn(financialAccountService, 'addFinancialAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ financialTransaction });
      comp.ngOnInit();

      expect(financialAccountService.query).toHaveBeenCalled();
      expect(financialAccountService.addFinancialAccountToCollectionIfMissing).toHaveBeenCalledWith(
        financialAccountCollection,
        ...additionalFinancialAccounts.map(expect.objectContaining)
      );
      expect(comp.financialAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Category query and add missing value', () => {
      const financialTransaction: IFinancialTransaction = { id: 456 };
      const category: ICategory = { id: 69320 };
      financialTransaction.category = category;

      const categoryCollection: ICategory[] = [{ id: 69207 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [category];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ financialTransaction });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining)
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Budget query and add missing value', () => {
      const financialTransaction: IFinancialTransaction = { id: 456 };
      const budget: IBudget = { id: 57361 };
      financialTransaction.budget = budget;

      const budgetCollection: IBudget[] = [{ id: 58103 }];
      jest.spyOn(budgetService, 'query').mockReturnValue(of(new HttpResponse({ body: budgetCollection })));
      const additionalBudgets = [budget];
      const expectedCollection: IBudget[] = [...additionalBudgets, ...budgetCollection];
      jest.spyOn(budgetService, 'addBudgetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ financialTransaction });
      comp.ngOnInit();

      expect(budgetService.query).toHaveBeenCalled();
      expect(budgetService.addBudgetToCollectionIfMissing).toHaveBeenCalledWith(
        budgetCollection,
        ...additionalBudgets.map(expect.objectContaining)
      );
      expect(comp.budgetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const financialTransaction: IFinancialTransaction = { id: 456 };
      const account: IFinancialAccount = { id: 66845 };
      financialTransaction.account = account;
      const category: ICategory = { id: 61620 };
      financialTransaction.category = category;
      const budget: IBudget = { id: 59502 };
      financialTransaction.budget = budget;

      activatedRoute.data = of({ financialTransaction });
      comp.ngOnInit();

      expect(comp.financialAccountsSharedCollection).toContain(account);
      expect(comp.categoriesSharedCollection).toContain(category);
      expect(comp.budgetsSharedCollection).toContain(budget);
      expect(comp.financialTransaction).toEqual(financialTransaction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialTransaction>>();
      const financialTransaction = { id: 123 };
      jest.spyOn(financialTransactionFormService, 'getFinancialTransaction').mockReturnValue(financialTransaction);
      jest.spyOn(financialTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: financialTransaction }));
      saveSubject.complete();

      // THEN
      expect(financialTransactionFormService.getFinancialTransaction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(financialTransactionService.update).toHaveBeenCalledWith(expect.objectContaining(financialTransaction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialTransaction>>();
      const financialTransaction = { id: 123 };
      jest.spyOn(financialTransactionFormService, 'getFinancialTransaction').mockReturnValue({ id: null });
      jest.spyOn(financialTransactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialTransaction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: financialTransaction }));
      saveSubject.complete();

      // THEN
      expect(financialTransactionFormService.getFinancialTransaction).toHaveBeenCalled();
      expect(financialTransactionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialTransaction>>();
      const financialTransaction = { id: 123 };
      jest.spyOn(financialTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(financialTransactionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFinancialAccount', () => {
      it('Should forward to financialAccountService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(financialAccountService, 'compareFinancialAccount');
        comp.compareFinancialAccount(entity, entity2);
        expect(financialAccountService.compareFinancialAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
