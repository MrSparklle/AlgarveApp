import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subject, EMPTY } from 'rxjs';
import { catchError, finalize, tap, takeUntil, take } from 'rxjs/operators';
import { BookingService } from '../../services/booking.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit, OnDestroy {
  public allBookings$: Observable<any>;
  public rulesBookings$: Observable<any>;
  public loadingError$ = new Subject<boolean>();
  public now: string = format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`);
  public history = false;
  public segments = 'nextbookings';
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private loadingCtrl: LoadingController,
    private bookingProvider: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  ionSegmentChange(ev: any) {
    if (ev.detail.value === 'nextbookings' || ev.detail.value === 'historybookings') {
      this.loadBookings();
    } else if (ev.detail.value === 'rules') {
      this.loadRulesBooking();
    }
  }

  public async loadBookings() {
    const loader = await this.loadingCtrl.create({});
    await loader.present();
    this.history = this.segments === 'nextbookings' ? false : true;

    this.allBookings$ = this.bookingProvider.getAllBookings(this.history).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(() => loader.dismiss()),
      catchError((error) => {
        console.error('Erro ao carregar reservas: ', error);
        this.loadingError$.next(true);
        loader.dismiss();
        return EMPTY;
      }),
      finalize(() => loader.dismiss())
    );
  }

  public async loadRulesBooking() {
    const loader = await this.loadingCtrl.create({});
    await loader.present();

    this.rulesBookings$ = this.bookingProvider
      .getRulesBooking()
      .pipe(
        take(1),
        tap(() => loader.dismiss()),
        catchError((error) => {
          console.error('Erro ao carregar regras de reservas: ', error);
          this.loadingError$.next(true);
          loader.dismiss();
          return EMPTY;
        })
      );
  }

  goToAddBooking() {
    this.router.navigateByUrl('/tabs/booking/booking-add');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log('destroy booking');
  }
}
