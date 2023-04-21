import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExpensesComponent } from '../list/expenses.component';
import { ExpensesDetailComponent } from '../detail/expenses-detail.component';
import { ExpensesUpdateComponent } from '../update/expenses-update.component';
import { ExpensesRoutingResolveService } from './expenses-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const expensesRoute: Routes = [
  {
    path: '',
    component: ExpensesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExpensesDetailComponent,
    resolve: {
      expenses: ExpensesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExpensesUpdateComponent,
    resolve: {
      expenses: ExpensesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExpensesUpdateComponent,
    resolve: {
      expenses: ExpensesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(expensesRoute)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
