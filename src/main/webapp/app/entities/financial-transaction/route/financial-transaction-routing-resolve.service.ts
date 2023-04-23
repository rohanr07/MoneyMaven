import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinancialTransaction } from '../financial-transaction.model';
import { FinancialTransactionService } from '../service/financial-transaction.service';

@Injectable({ providedIn: 'root' })
export class FinancialTransactionRoutingResolveService implements Resolve<IFinancialTransaction | null> {
  constructor(protected service: FinancialTransactionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinancialTransaction | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((financialTransaction: HttpResponse<IFinancialTransaction>) => {
          if (financialTransaction.body) {
            return of(financialTransaction.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
