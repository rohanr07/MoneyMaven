import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnalytics } from '../analytics.model';
import { AnalyticsService } from '../service/analytics.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsRoutingResolveService implements Resolve<IAnalytics | null> {
  constructor(protected service: AnalyticsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnalytics | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((analytics: HttpResponse<IAnalytics>) => {
          if (analytics.body) {
            return of(analytics.body);
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
