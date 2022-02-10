import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import SwiperCore, { Pagination, Swiper } from 'swiper';
import { IonicSlides } from '@ionic/angular';

SwiperCore.use([Pagination, IonicSlides]);

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  slides: any;

  showSkip = true;

  constructor(private storage: Storage, private router: Router, private ref: ChangeDetectorRef
    ) {}

  async startApp() {
    await this.router.navigate(['/tabs/home']);
    this.storage.set('hasSeenTutorial', 'true');
  }

  onSlideChange() {
    if (this.slides.isEnd) {
      this.showSkip = false;
    } else {
      this.showSkip = true;
    }
    this.ref.detectChanges();
  }

  swiperInit(swiper: any) {
    this.slides = swiper;
  }

  ngOnInit() {}
}
