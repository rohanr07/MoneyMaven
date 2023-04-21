import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExpensesFormService } from './expenses-form.service';
import { ExpensesService } from '../service/expenses.service';
import { IExpenses } from '../expenses.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ExpensesUpdateComponent } from './expenses-update.component';

describe('Expenses Management Update Component', () => {
  let comp: ExpensesUpdateComponent;
  let fixture: ComponentFixture<ExpensesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let expensesFormService: ExpensesFormService;
  let expensesService: ExpensesService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExpensesUpdateComponent],
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
      .overrideTemplate(ExpensesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpensesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    expensesFormService = TestBed.inject(ExpensesFormService);
    expensesService = TestBed.inject(ExpensesService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const expenses: IExpenses = { id: 456 };
      const user: IUser = { id: 68559 };
      expenses.user = user;

      const userCollection: IUser[] = [{ id: 72623 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ expenses });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const expenses: IExpenses = { id: 456 };
      const user: IUser = { id: 81520 };
      expenses.user = user;

      activatedRoute.data = of({ expenses });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.expenses).toEqual(expenses);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenses>>();
      const expenses = { id: 123 };
      jest.spyOn(expensesFormService, 'getExpenses').mockReturnValue(expenses);
      jest.spyOn(expensesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenses });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expenses }));
      saveSubject.complete();

      // THEN
      expect(expensesFormService.getExpenses).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(expensesService.update).toHaveBeenCalledWith(expect.objectContaining(expenses));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenses>>();
      const expenses = { id: 123 };
      jest.spyOn(expensesFormService, 'getExpenses').mockReturnValue({ id: null });
      jest.spyOn(expensesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenses: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expenses }));
      saveSubject.complete();

      // THEN
      expect(expensesFormService.getExpenses).toHaveBeenCalled();
      expect(expensesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenses>>();
      const expenses = { id: 123 };
      jest.spyOn(expensesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenses });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(expensesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
