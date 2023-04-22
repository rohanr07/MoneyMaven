import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IncomeComponent } from './list/income.component';
import { IncomeDetailComponent } from './detail/income-detail.component';
import { IncomeUpdateComponent } from './update/income-update.component';
import { IncomeDeleteDialogComponent } from './delete/income-delete-dialog.component';
import { IncomeRoutingModule } from './route/income-routing.module';

@NgModule({
  imports: [SharedModule, IncomeRoutingModule],
  declarations: [IncomeComponent, IncomeDetailComponent, IncomeUpdateComponent, IncomeDeleteDialogComponent],
})
export class IncomeModule {}
