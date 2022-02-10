import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Booking } from 'src/app/models/booking.interface';
import { BookingService } from 'src/app/services/booking.service';
import { ProfileService } from 'src/app/services/profile.service';
import { format, addYears } from 'date-fns';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.page.html',
  styleUrls: ['./booking-edit.page.scss'],
})
export class BookingEditPage implements OnInit {
  public bookingId: string;
  public bookingForm: FormGroup;
  public isIos: boolean = this.platform.is('ios');
  public $booking: Observable<Booking>;
  public profile = this.profileService.profile;
  public suiteList$: Observable<any>;
  public maxDate = format(addYears(new Date(), 1), 'yyyy');

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    public profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // recuperando parametro ID da notícia a ser editada
    this.bookingId = this.activatedRoute.snapshot.paramMap.get('bookingId');

    // criando formulário e suas validações
    this.bookingForm = this.formBuilder.group({
      title: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(40)]),
      ],
      dateBooking: ['', Validators.required],
      period: ['', Validators.required],
      highlight: false,
      notBill: false,
      profile: this.formBuilder.group({
        id: ['', Validators.required],
        suite: ['', Validators.required],
      }),
    });

    this.$booking = this.bookingService.getBookig(this.bookingId).pipe(
      // take(1),
      tap((booking) => {
        this.bookingForm.patchValue(booking);
      })
    );

    // carregando a lista dos aptos para o síndico poder alterar o apto da reserva.
    this.suiteList$ = this.profileService
      .getAllProfiles(true)
      .pipe(
        take(1),
        map((actions) => actions.map((snap) => snap.suite)),
      );

    // Está dando subscribe duplo e não está funcionando corretamente.
    combineLatest([this.$booking, this.suiteList$]).subscribe();
  }

  async updateBooking() {
    if (this.bookingForm.valid) {
      // verifica se não existe reserva já feita para o mesmo dia e períodos selecionados
      this.bookingService
        .existBooking(
          this.bookingForm.value.dateBooking,
          this.bookingForm.value.period,
          this.bookingId
        )
        .subscribe(async (snap) => {
          // retorna true se encontrou reserva ou false caso não encontre
          if (!snap.length) {
            const loader = await this.loadingCtrl.create({});
            await loader.present();

            // salvando os dados da reserva
            try {
              await this.bookingService.updateBooking(
                this.bookingId,
                this.bookingForm.value
              );
              this.router.navigate(['/tabs/booking']);
            } catch (error) {
              console.error(error);
              const alert = await this.alertCtrl.create({
                header: 'Erro',
                message:
                  'Não foi possível atualizar a reserva ocorreu um erro inesperado.',
                buttons: ['OK'],
              });
              await alert.present();
            } finally {
              await loader.dismiss();
            }
          } else {
            // se ja existir reserva para a data/período, emite alerta de erro ao usuario
            const alert = await this.alertCtrl.create({
              header: 'Erro',
              message:
                'Não foi possível alterar a reserva pois já existe outra reserva feita para a data e período(s) selecionado(s).',
              buttons: ['OK'],
            });
            await alert.present();
          }
        });
    }
  }
}
