import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BudgetComponent } from './list/budget.component';
import { BudgetDetailComponent } from './detail/budget-detail.component';
import { BudgetUpdateComponent } from './update/budget-update.component';
import { BudgetDeleteDialogComponent } from './delete/budget-delete-dialog.component';
import { BudgetRoutingModule } from './route/budget-routing.module';

@NgModule({
  imports: [SharedModule, BudgetRoutingModule],
  declarations: [BudgetComponent, BudgetDetailComponent, BudgetUpdateComponent, BudgetDeleteDialogComponent],
})
export class BudgetModule {}
