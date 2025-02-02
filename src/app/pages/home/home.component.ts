import { Component, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  qrData: string = `${window.location.origin}/exhibitor-register-form`
  qrCodeUrl: string = '';

  ngOnInit() {
    this.generateQRCode(this.qrData);
  }

  generateQRCode(data: string) {
    QRCode.toDataURL(data, { width: 220, margin: 2 }, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }
      this.qrCodeUrl = url;
    });
  }

  registerNow() {
    window.location.href = this.qrData; 
  }
}