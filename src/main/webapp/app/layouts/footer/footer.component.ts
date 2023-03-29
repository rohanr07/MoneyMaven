import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(private router: Router) {}
  loadGDPR() {
    this.router.navigate(['/gdpr']);
  }
  shouldShowFooter() {
    return this.router.url != '/gdpr';
  }
}
