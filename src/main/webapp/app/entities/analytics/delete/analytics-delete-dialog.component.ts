import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnalytics } from '../analytics.model';
import { AnalyticsService } from '../service/analytics.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './analytics-delete-dialog.component.html',
})
export class AnalyticsDeleteDialogComponent {
  analytics?: IAnalytics;

  constructor(protected analyticsService: AnalyticsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.analyticsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
