import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'expenses',
        data: { pageTitle: 'teamprojectApp.expenses.home.title' },
        loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule),
      },
      {
        path: 'income',
        data: { pageTitle: 'teamprojectApp.income.home.title' },
        loadChildren: () => import('./income/income.module').then(m => m.IncomeModule),
      },

      {
        path: 'analytics',
        data: { pageTitle: 'teamprojectApp.analytics.home.title' },
        loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
