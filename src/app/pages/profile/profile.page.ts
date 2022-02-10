import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Profile } from '../../models/profile.interface';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { ProfileService } from '../../services/profile.service';
import { environment } from '../../../environments/environment';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  public segments = 'profile';

  public profile$: Observable<Profile>;
  public userBookings$: Observable<any>;
  public loadingError$ = new Subject<boolean>();
  public history = false;
  public profileId: string;
  public version = environment.version;
  public darkTheme: boolean;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private bookingService: BookingService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private navController: NavController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this.profileId = this.profileService.profile.id;
    this.profile$ = this.profileService.getProfile(this.profileId);
    this.darkTheme = await this.storage.get('darkTheme');
  }

  // quando o usuário navega entre as abas
  ionSegmentChange(ev: any) {
    // se a aba selecionada for a de reservas
    if (ev.detail.value === 'bookings') {
      this.selectedBookings();
    }
  }

  // retorna todas as reservas futuras do usuário ou histórico
  selectedBookings() {
    this.userBookings$ = this.bookingService
      .getUserBookings(this.profileId, this.history)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((error) => {
          console.error('Erro ao carregar reservas do usuário: ', error);
          this.loadingError$.next(true);
          return EMPTY;
        })
      );
  }

  // efetuar rotinas de logout do usuário
  async logout(): Promise<void> {
    // redireciona para tela de login
    // this.router.navigate(['/login'], { replaceUrl: true });
    this.navController.navigateRoot(['/login']);

    try {
      // exclui os dados do token do aparelho do usuário logado para parar de receber push notifications
      await this.profileService.deleteToken(this.profileId);
    } catch (error) {
      // se der erro ao excluir o token não abortar o processo, apenas logar
      console.error('Erro ao excluir token do dispositivo do usuário: ', error);
    }

    try {
      // efetuando logout no firebase
      setTimeout(() => {
        this.authService.logoutUser();
      }, 2000);
    } catch (error) {
      console.error('Erro ao efetuar logout no firebase: ', error);
    }

    // limpando dados do usuário logado
    this.profileService.profile = null;
  }

  async presentActionSheet(profileId: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Editar Meus Dados',
          icon: 'create-outline',
          handler: () => {
            this.router.navigate([`/tabs/profile/profile-edit/${profileId}`]);
          },
        },
        {
          text: 'Desconectar',
          icon: 'log-out-outline',
          handler: () => {
            this.logout();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close-circle',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  toogleDarkTheme(ev: any) {
    document.body.classList.toggle('dark', ev.detail.checked);

    this.storage.set('darkTheme', ev.detail.checked);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log('destroy profile');
  }
}
