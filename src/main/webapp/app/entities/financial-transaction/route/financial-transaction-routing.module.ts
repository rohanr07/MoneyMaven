import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinancialTransactionComponent } from '../list/financial-transaction.component';
import { FinancialTransactionDetailComponent } from '../detail/financial-transaction-detail.component';
import { FinancialTransactionUpdateComponent } from '../update/financial-transaction-update.component';
import { FinancialTransactionRoutingResolveService } from './financial-transaction-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const financialTransactionRoute: Routes = [
  {
    path: '',
    component: FinancialTransactionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinancialTransactionDetailComponent,
    resolve: {
      financialTransaction: FinancialTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinancialTransactionUpdateComponent,
    resolve: {
      financialTransaction: FinancialTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinancialTransactionUpdateComponent,
    resolve: {
      financialTransaction: FinancialTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(financialTransactionRoute)],
  exports: [RouterModule],
})
export class FinancialTransactionRoutingModule {}
