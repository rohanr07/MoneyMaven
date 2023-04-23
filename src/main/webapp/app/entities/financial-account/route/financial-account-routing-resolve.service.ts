import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinancialAccount } from '../financial-account.model';
import { FinancialAccountService } from '../service/financial-account.service';

@Injectable({ providedIn: 'root' })
export class FinancialAccountRoutingResolveService implements Resolve<IFinancialAccount | null> {
  constructor(protected service: FinancialAccountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinancialAccount | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((financialAccount: HttpResponse<IFinancialAccount>) => {
          if (financialAccount.body) {
            return of(financialAccount.body);
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
