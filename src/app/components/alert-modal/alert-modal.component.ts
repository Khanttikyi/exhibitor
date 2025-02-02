import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {
  @Input() code: string = '';
  @Input() title: string = '';
  @Input() type: string = '';
  constructor(public activeModal: NgbActiveModal) { }

  closeModal() {
    this.activeModal.close();
  }

  saveAsImage() {
    const modalElement = document.querySelector('#modal-data');
    console.log(modalElement);
    if (modalElement) {
      html2canvas(modalElement as HTMLElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Exhibitor-(${this.code}).png`;
        link.click();
      });
    }
  }
}
