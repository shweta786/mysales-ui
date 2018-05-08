import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmResponse } from './confirm-response.enum';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.less']
})
export class ConfirmComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @ViewChild('content') content: TemplateRef<any>;
  @Output() confirmClosed: EventEmitter<ConfirmResponse> = new EventEmitter<ConfirmResponse>();
  modalRef: NgbModalRef;
  @Input() option1 = 'OK';
  @Input() option2 = 'Cancel'
  constructor(public activeModal: NgbModal) {}

  ngOnInit() {
  }

  showConfirmation(title = this.title, message = this.message, option1 = this.option1, option2 = this.option2): ConfirmComponent {
    this.title = title;
    this.message = message;
    this.option1 = option1;
    this.option2 = option2;
    this.modalRef = this.activeModal.open(this.content);
    return this;
  }

  close(action: string) {
    let result = action === 'ok' ? ConfirmResponse.Ok : ConfirmResponse.Cancel;
    this.confirmClosed.emit(result);
    this.modalRef.close();
  }
  closeModal() {
    this.modalRef.close();
  }
}
