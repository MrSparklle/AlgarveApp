import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import SwiperCore, { Pagination, Zoom, Navigation } from 'swiper';

SwiperCore.use([Pagination, Zoom, Navigation]);

@Component({
  selector: 'app-notice-image-view',
  templateUrl: './notice-image-view.page.html',
  styleUrls: ['./notice-image-view.page.scss'],
})
export class NoticeImageViewPage implements OnInit {
  @Input() title: string;
  @Input() imgUrls: string[];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
