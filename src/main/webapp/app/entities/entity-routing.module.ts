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
      {
        path: 'financial-transaction',
        data: { pageTitle: 'teamprojectApp.financialTransaction.home.title' },
        loadChildren: () => import('./financial-transaction/financial-transaction.module').then(m => m.FinancialTransactionModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'teamprojectApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'budget',
        data: { pageTitle: 'teamprojectApp.budget.home.title' },
        loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule),
      },
      {
        path: 'financial-account',
        data: { pageTitle: 'teamprojectApp.financialAccount.home.title' },
        loadChildren: () => import('./financial-account/financial-account.module').then(m => m.FinancialAccountModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
