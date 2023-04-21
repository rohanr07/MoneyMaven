import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExpenses, NewExpenses } from '../expenses.model';

export type PartialUpdateExpenses = Partial<IExpenses> & Pick<IExpenses, 'id'>;

type RestOf<T extends IExpenses | NewExpenses> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestExpenses = RestOf<IExpenses>;

export type NewRestExpenses = RestOf<NewExpenses>;

export type PartialUpdateRestExpenses = RestOf<PartialUpdateExpenses>;

export type EntityResponseType = HttpResponse<IExpenses>;
export type EntityArrayResponseType = HttpResponse<IExpenses[]>;

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/expenses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(expenses: NewExpenses): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenses);
    return this.http
      .post<RestExpenses>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(expenses: IExpenses): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenses);
    return this.http
      .put<RestExpenses>(`${this.resourceUrl}/${this.getExpensesIdentifier(expenses)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(expenses: PartialUpdateExpenses): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenses);
    return this.http
      .patch<RestExpenses>(`${this.resourceUrl}/${this.getExpensesIdentifier(expenses)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestExpenses>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExpenses[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExpensesIdentifier(expenses: Pick<IExpenses, 'id'>): number {
    return expenses.id;
  }

  compareExpenses(o1: Pick<IExpenses, 'id'> | null, o2: Pick<IExpenses, 'id'> | null): boolean {
    return o1 && o2 ? this.getExpensesIdentifier(o1) === this.getExpensesIdentifier(o2) : o1 === o2;
  }

  addExpensesToCollectionIfMissing<Type extends Pick<IExpenses, 'id'>>(
    expensesCollection: Type[],
    ...expensesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const expenses: Type[] = expensesToCheck.filter(isPresent);
    if (expenses.length > 0) {
      const expensesCollectionIdentifiers = expensesCollection.map(expensesItem => this.getExpensesIdentifier(expensesItem)!);
      const expensesToAdd = expenses.filter(expensesItem => {
        const expensesIdentifier = this.getExpensesIdentifier(expensesItem);
        if (expensesCollectionIdentifiers.includes(expensesIdentifier)) {
          return false;
        }
        expensesCollectionIdentifiers.push(expensesIdentifier);
        return true;
      });
      return [...expensesToAdd, ...expensesCollection];
    }
    return expensesCollection;
  }

  protected convertDateFromClient<T extends IExpenses | NewExpenses | PartialUpdateExpenses>(expenses: T): RestOf<T> {
    return {
      ...expenses,
      date: expenses.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restExpenses: RestExpenses): IExpenses {
    return {
      ...restExpenses,
      date: restExpenses.date ? dayjs(restExpenses.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExpenses>): HttpResponse<IExpenses> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExpenses[]>): HttpResponse<IExpenses[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
