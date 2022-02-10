import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})
export class OfflinePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  async tryReconnect() {
    const status = await Network.getStatus();
    if (status.connected) {
      this.router.navigate(['/tabs']);
    }
  }
}
