import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AnalyticsFormService } from './analytics-form.service';
import { AnalyticsService } from '../service/analytics.service';
import { IAnalytics } from '../analytics.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { AnalyticsUpdateComponent } from './analytics-update.component';

describe('Analytics Management Update Component', () => {
  let comp: AnalyticsUpdateComponent;
  let fixture: ComponentFixture<AnalyticsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let analyticsFormService: AnalyticsFormService;
  let analyticsService: AnalyticsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AnalyticsUpdateComponent],
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
      .overrideTemplate(AnalyticsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnalyticsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    analyticsFormService = TestBed.inject(AnalyticsFormService);
    analyticsService = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const analytics: IAnalytics = { id: 456 };
      const user: IUser = { id: 18791 };
      analytics.user = user;

      const userCollection: IUser[] = [{ id: 75146 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ analytics });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const analytics: IAnalytics = { id: 456 };
      const user: IUser = { id: 87146 };
      analytics.user = user;

      activatedRoute.data = of({ analytics });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.analytics).toEqual(analytics);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnalytics>>();
      const analytics = { id: 123 };
      jest.spyOn(analyticsFormService, 'getAnalytics').mockReturnValue(analytics);
      jest.spyOn(analyticsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ analytics });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: analytics }));
      saveSubject.complete();

      // THEN
      expect(analyticsFormService.getAnalytics).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(analyticsService.update).toHaveBeenCalledWith(expect.objectContaining(analytics));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnalytics>>();
      const analytics = { id: 123 };
      jest.spyOn(analyticsFormService, 'getAnalytics').mockReturnValue({ id: null });
      jest.spyOn(analyticsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ analytics: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: analytics }));
      saveSubject.complete();

      // THEN
      expect(analyticsFormService.getAnalytics).toHaveBeenCalled();
      expect(analyticsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnalytics>>();
      const analytics = { id: 123 };
      jest.spyOn(analyticsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ analytics });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(analyticsService.update).toHaveBeenCalled();
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
