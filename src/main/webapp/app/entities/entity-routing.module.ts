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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
