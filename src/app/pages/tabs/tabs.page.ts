import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/models/booking.interface';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  boookingCount: Observable<Booking[]>;

  constructor(private bookingService: BookingService) {}

  async ngOnInit() {
    // traz o total de reservas ativas para mostrar a quantidade no badge do ícone
    this.boookingCount = this.bookingService.getAllCountBookings();
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
