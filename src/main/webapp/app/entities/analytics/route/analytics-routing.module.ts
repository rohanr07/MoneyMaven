import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnalyticsComponent } from '../list/analytics.component';
import { AnalyticsDetailComponent } from '../detail/analytics-detail.component';
import { AnalyticsUpdateComponent } from '../update/analytics-update.component';
import { AnalyticsRoutingResolveService } from './analytics-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const analyticsRoute: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnalyticsDetailComponent,
    resolve: {
      analytics: AnalyticsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnalyticsUpdateComponent,
    resolve: {
      analytics: AnalyticsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnalyticsUpdateComponent,
    resolve: {
      analytics: AnalyticsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(analyticsRoute)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule {}
