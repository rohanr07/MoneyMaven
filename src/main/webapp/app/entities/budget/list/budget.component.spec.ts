import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BudgetService } from '../service/budget.service';

import { BudgetComponent } from './budget.component';

describe('Budget Management Component', () => {
  let comp: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'budget', component: BudgetComponent }]), HttpClientTestingModule],
      declarations: [BudgetComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BudgetComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BudgetComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BudgetService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.budgets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to budgetService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBudgetIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBudgetIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
