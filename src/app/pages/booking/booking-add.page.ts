import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ProfileService } from '../../services/profile.service';
import { addDays, format, endOfDay, addYears, parseISO } from 'date-fns';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.page.html',
  styleUrls: ['./booking-add.page.scss'],
})
export class BookingAddPage implements OnInit {
  public bookingForm: FormGroup;
  public maxDate = format(addYears(new Date(), 1), 'yyyy');
  public profile = this.profileService.profile;
  public isIos = this.platform.is('ios');
  public suiteList$: Observable<any>;

  constructor(
    private platform: Platform,
    private bookingService: BookingService,
    public profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // criando formulário e suas validações
    this.bookingForm = this.formBuilder.group({
      title: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(40)]),
      ],
      dateBooking: [
        format(addDays(endOfDay(new Date()), 1), `yyyy-MM-dd'T'HH:mm:ss`),
        Validators.required,
      ],
      dateCreated: format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`),
      period: ['', Validators.required],
      readedRules: [false, Validators.requiredTrue],
      highlight: false,
      notBill: false,
      profile: this.formBuilder.group({
        id: [this.profileService.profile.id, Validators.required],
        suite: [
          this.profileService.profile?.suite?.toString(),
          Validators.required,
        ],
      }),
    });

    // carregando a lista dos aptos para o síndico poder agendar para outros moradores
    this.suiteList$ = this.profileService.getAllProfiles(true).pipe(
      take(1),
      finalize(() => {
        // depois de carregar toda lista de aptos, faz o patch do form para os dados do morador logado
        this.bookingForm.patchValue({
          profile: {
            id: this.profileService.profile.id,
            suite: this.profileService.profile.suite,
          },
        });
      })
    );
  }

  // solicita confirmação para inclusão da reserva
  async confirmAddBooking() {
    // é preciso fazer o format para calcular o timezone da data corretamente quando for horário de verão.
    // O endOfDay() converte em hora local independente do timezone passado
    this.bookingForm.patchValue({
      profile: {
        id: '00000100100' + this.bookingForm.value.profile.suite,
      },
      dateBooking: format(
        endOfDay(parseISO(this.bookingForm.value.dateBooking)),
        `yyyy-MM-dd'T'HH:mm:ssxxx`
      ),
    });

    const confirm = await this.alertCtrl.create({
      header:
        'Confirma inclusão da reserva para ' +
        format(parseISO(this.bookingForm.value.dateBooking), 'dd/MM/yyyy') +
        '?',
      message: `<p> Após inclusão só será possível cancelar a reserva 24h antes desta data.</p>
         <p> Reservas realizadas serão cobradas conforme regras estipuladas em ata</p>`,
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.addBooking();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await confirm.present();
  }

  // adiciona nova reserva na base de dados
  async addBooking() {
    if (this.bookingForm.valid) {
      // verifica se não existe reserva já feita para o mesmo dia e períodos selecionados
      this.bookingService
        .existBooking(
          this.bookingForm.value.dateBooking,
          this.bookingForm.value.period
        )
        .pipe(tap((dados) => console.log(dados)))
        .subscribe(async (snap) => {
          // retorna true se encontrou reserva ou false caso não encontre
          if (!snap.length) {
            const loader = await this.loadingCtrl.create({});
            await loader.present();

            // salvando os dados da reserva
            try {
              await this.bookingService.addBooking(this.bookingForm.value);
              this.router.navigate(['/tabs/booking']);
            } catch (error) {
              console.error(error);
              const alert = await this.alertCtrl.create({
                header: 'Erro',
                message:
                  'Não foi possível realizar sua reserva ocorreu um erro inesperado.',
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
                'Não foi possível realizar sua reserva pois já existe outra reserva feita para a data e período(s) selecionado(s).',
              buttons: ['OK'],
            });
            await alert.present();
          }
        });
    }
  }
}
