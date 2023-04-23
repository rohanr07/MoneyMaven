import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinancialTransactionComponent } from './list/financial-transaction.component';
import { FinancialTransactionDetailComponent } from './detail/financial-transaction-detail.component';
import { FinancialTransactionUpdateComponent } from './update/financial-transaction-update.component';
import { FinancialTransactionDeleteDialogComponent } from './delete/financial-transaction-delete-dialog.component';
import { FinancialTransactionRoutingModule } from './route/financial-transaction-routing.module';

@NgModule({
  imports: [SharedModule, FinancialTransactionRoutingModule],
  declarations: [
    FinancialTransactionComponent,
    FinancialTransactionDetailComponent,
    FinancialTransactionUpdateComponent,
    FinancialTransactionDeleteDialogComponent,
  ],
})
export class FinancialTransactionModule {}
