import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinancialTransaction } from '../financial-transaction.model';
import { FinancialTransactionService } from '../service/financial-transaction.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './financial-transaction-delete-dialog.component.html',
})
export class FinancialTransactionDeleteDialogComponent {
  financialTransaction?: IFinancialTransaction;

  constructor(protected financialTransactionService: FinancialTransactionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.financialTransactionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
