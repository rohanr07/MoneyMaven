import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FinancialAccountService } from '../service/financial-account.service';

import { FinancialAccountComponent } from './financial-account.component';

describe('FinancialAccount Management Component', () => {
  let comp: FinancialAccountComponent;
  let fixture: ComponentFixture<FinancialAccountComponent>;
  let service: FinancialAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'financial-account', component: FinancialAccountComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [FinancialAccountComponent],
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
      .overrideTemplate(FinancialAccountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FinancialAccountService);

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
    expect(comp.financialAccounts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to financialAccountService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFinancialAccountIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFinancialAccountIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
