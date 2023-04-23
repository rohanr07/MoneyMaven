jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FinancialAccountService } from '../service/financial-account.service';

import { FinancialAccountDeleteDialogComponent } from './financial-account-delete-dialog.component';

describe('FinancialAccount Management Delete Component', () => {
  let comp: FinancialAccountDeleteDialogComponent;
  let fixture: ComponentFixture<FinancialAccountDeleteDialogComponent>;
  let service: FinancialAccountService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FinancialAccountDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(FinancialAccountDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinancialAccountDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FinancialAccountService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
