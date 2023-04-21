import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExpenses } from '../expenses.model';
import { ExpensesService } from '../service/expenses.service';

@Injectable({ providedIn: 'root' })
export class ExpensesRoutingResolveService implements Resolve<IExpenses | null> {
  constructor(protected service: ExpensesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExpenses | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((expenses: HttpResponse<IExpenses>) => {
          if (expenses.body) {
            return of(expenses.body);
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
