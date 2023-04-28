import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnalyticsDetailComponent } from './analytics-detail.component';

describe('Analytics Management Detail Component', () => {
  let comp: AnalyticsDetailComponent;
  let fixture: ComponentFixture<AnalyticsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ analytics: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AnalyticsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AnalyticsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load analytics on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.analytics).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
