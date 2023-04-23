import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinancialTransaction, NewFinancialTransaction } from '../financial-transaction.model';

export type PartialUpdateFinancialTransaction = Partial<IFinancialTransaction> & Pick<IFinancialTransaction, 'id'>;

type RestOf<T extends IFinancialTransaction | NewFinancialTransaction> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestFinancialTransaction = RestOf<IFinancialTransaction>;

export type NewRestFinancialTransaction = RestOf<NewFinancialTransaction>;

export type PartialUpdateRestFinancialTransaction = RestOf<PartialUpdateFinancialTransaction>;

export type EntityResponseType = HttpResponse<IFinancialTransaction>;
export type EntityArrayResponseType = HttpResponse<IFinancialTransaction[]>;

@Injectable({ providedIn: 'root' })
export class FinancialTransactionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/financial-transactions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(financialTransaction: NewFinancialTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(financialTransaction);
    return this.http
      .post<RestFinancialTransaction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(financialTransaction: IFinancialTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(financialTransaction);
    return this.http
      .put<RestFinancialTransaction>(`${this.resourceUrl}/${this.getFinancialTransactionIdentifier(financialTransaction)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(financialTransaction: PartialUpdateFinancialTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(financialTransaction);
    return this.http
      .patch<RestFinancialTransaction>(`${this.resourceUrl}/${this.getFinancialTransactionIdentifier(financialTransaction)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFinancialTransaction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFinancialTransaction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFinancialTransactionIdentifier(financialTransaction: Pick<IFinancialTransaction, 'id'>): number {
    return financialTransaction.id;
  }

  compareFinancialTransaction(o1: Pick<IFinancialTransaction, 'id'> | null, o2: Pick<IFinancialTransaction, 'id'> | null): boolean {
    return o1 && o2 ? this.getFinancialTransactionIdentifier(o1) === this.getFinancialTransactionIdentifier(o2) : o1 === o2;
  }

  addFinancialTransactionToCollectionIfMissing<Type extends Pick<IFinancialTransaction, 'id'>>(
    financialTransactionCollection: Type[],
    ...financialTransactionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const financialTransactions: Type[] = financialTransactionsToCheck.filter(isPresent);
    if (financialTransactions.length > 0) {
      const financialTransactionCollectionIdentifiers = financialTransactionCollection.map(
        financialTransactionItem => this.getFinancialTransactionIdentifier(financialTransactionItem)!
      );
      const financialTransactionsToAdd = financialTransactions.filter(financialTransactionItem => {
        const financialTransactionIdentifier = this.getFinancialTransactionIdentifier(financialTransactionItem);
        if (financialTransactionCollectionIdentifiers.includes(financialTransactionIdentifier)) {
          return false;
        }
        financialTransactionCollectionIdentifiers.push(financialTransactionIdentifier);
        return true;
      });
      return [...financialTransactionsToAdd, ...financialTransactionCollection];
    }
    return financialTransactionCollection;
  }

  protected convertDateFromClient<T extends IFinancialTransaction | NewFinancialTransaction | PartialUpdateFinancialTransaction>(
    financialTransaction: T
  ): RestOf<T> {
    return {
      ...financialTransaction,
      date: financialTransaction.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFinancialTransaction: RestFinancialTransaction): IFinancialTransaction {
    return {
      ...restFinancialTransaction,
      date: restFinancialTransaction.date ? dayjs(restFinancialTransaction.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFinancialTransaction>): HttpResponse<IFinancialTransaction> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFinancialTransaction[]>): HttpResponse<IFinancialTransaction[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
