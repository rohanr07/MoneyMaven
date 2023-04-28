import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnalytics, NewAnalytics } from '../analytics.model';

export type PartialUpdateAnalytics = Partial<IAnalytics> & Pick<IAnalytics, 'id'>;

type RestOf<T extends IAnalytics | NewAnalytics> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestAnalytics = RestOf<IAnalytics>;

export type NewRestAnalytics = RestOf<NewAnalytics>;

export type PartialUpdateRestAnalytics = RestOf<PartialUpdateAnalytics>;

export type EntityResponseType = HttpResponse<IAnalytics>;
export type EntityArrayResponseType = HttpResponse<IAnalytics[]>;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/analytics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(analytics: NewAnalytics): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(analytics);
    return this.http
      .post<RestAnalytics>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(analytics: IAnalytics): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(analytics);
    return this.http
      .put<RestAnalytics>(`${this.resourceUrl}/${this.getAnalyticsIdentifier(analytics)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(analytics: PartialUpdateAnalytics): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(analytics);
    return this.http
      .patch<RestAnalytics>(`${this.resourceUrl}/${this.getAnalyticsIdentifier(analytics)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAnalytics>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAnalytics[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnalyticsIdentifier(analytics: Pick<IAnalytics, 'id'>): number {
    return analytics.id;
  }

  compareAnalytics(o1: Pick<IAnalytics, 'id'> | null, o2: Pick<IAnalytics, 'id'> | null): boolean {
    return o1 && o2 ? this.getAnalyticsIdentifier(o1) === this.getAnalyticsIdentifier(o2) : o1 === o2;
  }

  addAnalyticsToCollectionIfMissing<Type extends Pick<IAnalytics, 'id'>>(
    analyticsCollection: Type[],
    ...analyticsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const analytics: Type[] = analyticsToCheck.filter(isPresent);
    if (analytics.length > 0) {
      const analyticsCollectionIdentifiers = analyticsCollection.map(analyticsItem => this.getAnalyticsIdentifier(analyticsItem)!);
      const analyticsToAdd = analytics.filter(analyticsItem => {
        const analyticsIdentifier = this.getAnalyticsIdentifier(analyticsItem);
        if (analyticsCollectionIdentifiers.includes(analyticsIdentifier)) {
          return false;
        }
        analyticsCollectionIdentifiers.push(analyticsIdentifier);
        return true;
      });
      return [...analyticsToAdd, ...analyticsCollection];
    }
    return analyticsCollection;
  }

  protected convertDateFromClient<T extends IAnalytics | NewAnalytics | PartialUpdateAnalytics>(analytics: T): RestOf<T> {
    return {
      ...analytics,
      date: analytics.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restAnalytics: RestAnalytics): IAnalytics {
    return {
      ...restAnalytics,
      date: restAnalytics.date ? dayjs(restAnalytics.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAnalytics>): HttpResponse<IAnalytics> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAnalytics[]>): HttpResponse<IAnalytics[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
