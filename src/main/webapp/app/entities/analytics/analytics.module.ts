import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AnalyticsComponent } from './list/analytics.component';
import { AnalyticsDetailComponent } from './detail/analytics-detail.component';
import { AnalyticsUpdateComponent } from './update/analytics-update.component';
import { AnalyticsDeleteDialogComponent } from './delete/analytics-delete-dialog.component';
import { AnalyticsRoutingModule } from './route/analytics-routing.module';

@NgModule({
  imports: [SharedModule, AnalyticsRoutingModule],
  declarations: [AnalyticsComponent, AnalyticsDetailComponent, AnalyticsUpdateComponent, AnalyticsDeleteDialogComponent],
})
export class AnalyticsModule {}
