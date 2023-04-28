import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnalytics } from '../analytics.model';

@Component({
  selector: 'jhi-analytics-detail',
  templateUrl: './analytics-detail.component.html',
})
export class AnalyticsDetailComponent implements OnInit {
  analytics: IAnalytics | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ analytics }) => {
      this.analytics = analytics;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
