import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinancialAccount, NewFinancialAccount } from '../financial-account.model';

export type PartialUpdateFinancialAccount = Partial<IFinancialAccount> & Pick<IFinancialAccount, 'id'>;

export type EntityResponseType = HttpResponse<IFinancialAccount>;
export type EntityArrayResponseType = HttpResponse<IFinancialAccount[]>;

@Injectable({ providedIn: 'root' })
export class FinancialAccountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/financial-accounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(financialAccount: NewFinancialAccount): Observable<EntityResponseType> {
    return this.http.post<IFinancialAccount>(this.resourceUrl, financialAccount, { observe: 'response' });
  }

  update(financialAccount: IFinancialAccount): Observable<EntityResponseType> {
    return this.http.put<IFinancialAccount>(
      `${this.resourceUrl}/${this.getFinancialAccountIdentifier(financialAccount)}`,
      financialAccount,
      { observe: 'response' }
    );
  }

  partialUpdate(financialAccount: PartialUpdateFinancialAccount): Observable<EntityResponseType> {
    return this.http.patch<IFinancialAccount>(
      `${this.resourceUrl}/${this.getFinancialAccountIdentifier(financialAccount)}`,
      financialAccount,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFinancialAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFinancialAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFinancialAccountIdentifier(financialAccount: Pick<IFinancialAccount, 'id'>): number {
    return financialAccount.id;
  }

  compareFinancialAccount(o1: Pick<IFinancialAccount, 'id'> | null, o2: Pick<IFinancialAccount, 'id'> | null): boolean {
    return o1 && o2 ? this.getFinancialAccountIdentifier(o1) === this.getFinancialAccountIdentifier(o2) : o1 === o2;
  }

  addFinancialAccountToCollectionIfMissing<Type extends Pick<IFinancialAccount, 'id'>>(
    financialAccountCollection: Type[],
    ...financialAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const financialAccounts: Type[] = financialAccountsToCheck.filter(isPresent);
    if (financialAccounts.length > 0) {
      const financialAccountCollectionIdentifiers = financialAccountCollection.map(
        financialAccountItem => this.getFinancialAccountIdentifier(financialAccountItem)!
      );
      const financialAccountsToAdd = financialAccounts.filter(financialAccountItem => {
        const financialAccountIdentifier = this.getFinancialAccountIdentifier(financialAccountItem);
        if (financialAccountCollectionIdentifiers.includes(financialAccountIdentifier)) {
          return false;
        }
        financialAccountCollectionIdentifiers.push(financialAccountIdentifier);
        return true;
      });
      return [...financialAccountsToAdd, ...financialAccountCollection];
    }
    return financialAccountCollection;
  }
}
