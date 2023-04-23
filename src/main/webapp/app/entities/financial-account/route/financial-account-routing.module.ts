import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinancialAccountComponent } from '../list/financial-account.component';
import { FinancialAccountDetailComponent } from '../detail/financial-account-detail.component';
import { FinancialAccountUpdateComponent } from '../update/financial-account-update.component';
import { FinancialAccountRoutingResolveService } from './financial-account-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const financialAccountRoute: Routes = [
  {
    path: '',
    component: FinancialAccountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinancialAccountDetailComponent,
    resolve: {
      financialAccount: FinancialAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinancialAccountUpdateComponent,
    resolve: {
      financialAccount: FinancialAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinancialAccountUpdateComponent,
    resolve: {
      financialAccount: FinancialAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(financialAccountRoute)],
  exports: [RouterModule],
})
export class FinancialAccountRoutingModule {}
