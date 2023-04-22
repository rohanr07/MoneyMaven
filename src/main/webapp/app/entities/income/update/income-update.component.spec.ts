import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IncomeFormService } from './income-form.service';
import { IncomeService } from '../service/income.service';
import { IIncome } from '../income.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { IncomeUpdateComponent } from './income-update.component';

describe('Income Management Update Component', () => {
  let comp: IncomeUpdateComponent;
  let fixture: ComponentFixture<IncomeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let incomeFormService: IncomeFormService;
  let incomeService: IncomeService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IncomeUpdateComponent],
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
      .overrideTemplate(IncomeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IncomeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    incomeFormService = TestBed.inject(IncomeFormService);
    incomeService = TestBed.inject(IncomeService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const income: IIncome = { id: 456 };
      const user: IUser = { id: 36110 };
      income.user = user;

      const userCollection: IUser[] = [{ id: 62608 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ income });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const income: IIncome = { id: 456 };
      const user: IUser = { id: 65372 };
      income.user = user;

      activatedRoute.data = of({ income });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.income).toEqual(income);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIncome>>();
      const income = { id: 123 };
      jest.spyOn(incomeFormService, 'getIncome').mockReturnValue(income);
      jest.spyOn(incomeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ income });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: income }));
      saveSubject.complete();

      // THEN
      expect(incomeFormService.getIncome).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(incomeService.update).toHaveBeenCalledWith(expect.objectContaining(income));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIncome>>();
      const income = { id: 123 };
      jest.spyOn(incomeFormService, 'getIncome').mockReturnValue({ id: null });
      jest.spyOn(incomeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ income: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: income }));
      saveSubject.complete();

      // THEN
      expect(incomeFormService.getIncome).toHaveBeenCalled();
      expect(incomeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIncome>>();
      const income = { id: 123 };
      jest.spyOn(incomeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ income });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(incomeService.update).toHaveBeenCalled();
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
