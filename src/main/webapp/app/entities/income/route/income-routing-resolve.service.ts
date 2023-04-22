import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIncome } from '../income.model';
import { IncomeService } from '../service/income.service';

@Injectable({ providedIn: 'root' })
export class IncomeRoutingResolveService implements Resolve<IIncome | null> {
  constructor(protected service: IncomeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIncome | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((income: HttpResponse<IIncome>) => {
          if (income.body) {
            return of(income.body);
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
