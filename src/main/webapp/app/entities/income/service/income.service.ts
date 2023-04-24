import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIncome, NewIncome } from '../income.model';
import { IExpenses } from '../../expenses/expenses.model';

export type PartialUpdateIncome = Partial<IIncome> & Pick<IIncome, 'id'>;

type RestOf<T extends IIncome | NewIncome> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestIncome = RestOf<IIncome>;

export type NewRestIncome = RestOf<NewIncome>;

export type PartialUpdateRestIncome = RestOf<PartialUpdateIncome>;

export type EntityResponseType = HttpResponse<IIncome>;
export type EntityArrayResponseType = HttpResponse<IIncome[]>;

@Injectable({ providedIn: 'root' })
export class IncomeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/incomes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(income: NewIncome): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(income);
    return this.http
      .post<RestIncome>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(income: IIncome): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(income);
    return this.http
      .put<RestIncome>(`${this.resourceUrl}/${this.getIncomeIdentifier(income)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(income: PartialUpdateIncome): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(income);
    return this.http
      .patch<RestIncome>(`${this.resourceUrl}/${this.getIncomeIdentifier(income)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestIncome>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestIncome[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIncomeIdentifier(income: Pick<IIncome, 'id'>): number {
    return income.id;
  }

  compareIncome(o1: Pick<IIncome, 'id'> | null, o2: Pick<IIncome, 'id'> | null): boolean {
    return o1 && o2 ? this.getIncomeIdentifier(o1) === this.getIncomeIdentifier(o2) : o1 === o2;
  }

  addIncomeToCollectionIfMissing<Type extends Pick<IIncome, 'id'>>(
    incomeCollection: Type[],
    ...incomesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const incomes: Type[] = incomesToCheck.filter(isPresent);
    if (incomes.length > 0) {
      const incomeCollectionIdentifiers = incomeCollection.map(incomeItem => this.getIncomeIdentifier(incomeItem)!);
      const incomesToAdd = incomes.filter(incomeItem => {
        const incomeIdentifier = this.getIncomeIdentifier(incomeItem);
        if (incomeCollectionIdentifiers.includes(incomeIdentifier)) {
          return false;
        }
        incomeCollectionIdentifiers.push(incomeIdentifier);
        return true;
      });
      return [...incomesToAdd, ...incomeCollection];
    }
    return incomeCollection;
  }

  protected convertDateFromClient<T extends IIncome | NewIncome | PartialUpdateIncome>(income: T): RestOf<T> {
    return {
      ...income,
      date: income.date?.format(DATE_FORMAT) ?? null,
    };
  }

  getIncomeBetweenDates(start: Date, end: Date, login: string): Observable<IIncome[]> {
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const url = `${this.resourceUrl}?created_dt.greaterThanOrEqual=${startIso}&created_dt.lessThanOrEqual=${endIso}`;
    return this.http.get<IIncome[]>(url);
  }

  protected convertDateFromServer(restIncome: RestIncome): IIncome {
    return {
      ...restIncome,
      date: restIncome.date ? dayjs(restIncome.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestIncome>): HttpResponse<IIncome> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestIncome[]>): HttpResponse<IIncome[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
