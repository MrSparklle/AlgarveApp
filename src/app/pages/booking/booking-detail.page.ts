import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Booking } from 'src/app/models/booking.interface';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  public booking$: Observable<Booking>;
  public isIos = this.platform.is('ios');
  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    public bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');

    // buscando as informações do morador passado como parametro
    this.booking$ = this.bookingService.getBookig(bookingId);
  }

  // quando usuário excluir a reserva, redireciona-lo para página com a listagem das reservas
  bookingDeleted() {
    console.log('router navigage');
    this.router.navigate(['/tabs/booking']);
  }
}
