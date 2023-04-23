import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinancialAccountComponent } from './list/financial-account.component';
import { FinancialAccountDetailComponent } from './detail/financial-account-detail.component';
import { FinancialAccountUpdateComponent } from './update/financial-account-update.component';
import { FinancialAccountDeleteDialogComponent } from './delete/financial-account-delete-dialog.component';
import { FinancialAccountRoutingModule } from './route/financial-account-routing.module';

@NgModule({
  imports: [SharedModule, FinancialAccountRoutingModule],
  declarations: [
    FinancialAccountComponent,
    FinancialAccountDetailComponent,
    FinancialAccountUpdateComponent,
    FinancialAccountDeleteDialogComponent,
  ],
})
export class FinancialAccountModule {}
