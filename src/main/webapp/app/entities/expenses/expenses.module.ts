import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExpensesComponent } from './list/expenses.component';
import { ExpensesDetailComponent } from './detail/expenses-detail.component';
import { ExpensesUpdateComponent } from './update/expenses-update.component';
import { ExpensesDeleteDialogComponent } from './delete/expenses-delete-dialog.component';
import { ExpensesRoutingModule } from './route/expenses-routing.module';

@NgModule({
  imports: [SharedModule, ExpensesRoutingModule],
  declarations: [ExpensesComponent, ExpensesDetailComponent, ExpensesUpdateComponent, ExpensesDeleteDialogComponent],
})
export class ExpensesModule {}
