import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinancialAccountFormService } from './financial-account-form.service';
import { FinancialAccountService } from '../service/financial-account.service';
import { IFinancialAccount } from '../financial-account.model';

import { FinancialAccountUpdateComponent } from './financial-account-update.component';

describe('FinancialAccount Management Update Component', () => {
  let comp: FinancialAccountUpdateComponent;
  let fixture: ComponentFixture<FinancialAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let financialAccountFormService: FinancialAccountFormService;
  let financialAccountService: FinancialAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinancialAccountUpdateComponent],
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
      .overrideTemplate(FinancialAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    financialAccountFormService = TestBed.inject(FinancialAccountFormService);
    financialAccountService = TestBed.inject(FinancialAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const financialAccount: IFinancialAccount = { id: 456 };

      activatedRoute.data = of({ financialAccount });
      comp.ngOnInit();

      expect(comp.financialAccount).toEqual(financialAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialAccount>>();
      const financialAccount = { id: 123 };
      jest.spyOn(financialAccountFormService, 'getFinancialAccount').mockReturnValue(financialAccount);
      jest.spyOn(financialAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: financialAccount }));
      saveSubject.complete();

      // THEN
      expect(financialAccountFormService.getFinancialAccount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(financialAccountService.update).toHaveBeenCalledWith(expect.objectContaining(financialAccount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialAccount>>();
      const financialAccount = { id: 123 };
      jest.spyOn(financialAccountFormService, 'getFinancialAccount').mockReturnValue({ id: null });
      jest.spyOn(financialAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialAccount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: financialAccount }));
      saveSubject.complete();

      // THEN
      expect(financialAccountFormService.getFinancialAccount).toHaveBeenCalled();
      expect(financialAccountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialAccount>>();
      const financialAccount = { id: 123 };
      jest.spyOn(financialAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(financialAccountService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
