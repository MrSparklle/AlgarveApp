import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import {
  Platform,
  IonInfiniteScroll,
  AlertController,
  ModalController,
} from '@ionic/angular';
import {
  Observable,
  Subject,
  EMPTY,
  Subscription,
  BehaviorSubject,
} from 'rxjs';
import { catchError, tap, scan, map } from 'rxjs/operators';
import { Notices } from '../../models/notices.interface';
import { ProfileService } from 'src/app/services/profile.service';
import { ref, Storage, deleteObject } from '@angular/fire/storage';
import SwiperCore, { Pagination, Zoom } from 'swiper';
import { NoticeImageViewPage } from './notice-image-view.page';

SwiperCore.use([Pagination, Zoom]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public publicNotices$: Observable<Notices[]>;
  public loadingError$ = new Subject<boolean>();
  public disableInfinite$ = new BehaviorSubject<boolean>(false);
  public issues: Observable<any[]>;
  public segments = 'notices';
  public isMD = this.plataform.is('android');
  public limit = 6;
  public lastVisible = {} as Notices;
  public noticesSubscription: Subscription;
  public profile = this.profileService.profile;

  private noticesPage$ = new Subject<Notices[]>();
  private deletedIndex: number;

  constructor(
    private noticesService: NoticeService,
    public profileService: ProfileService,
    private alertCtrl: AlertController,
    private plataform: Platform,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    // dispara a primeira pagina das notícias
    this.loadNotices();

    // faz a inscrição no observable que vai emitir as notícias paginadas
    this.publicNotices$ = this.noticesPage$.asObservable().pipe(
      scan((acc, val) => {
        // faz um merge da lista atual com uma nova página de registros ordenando pela dateCreated
        // detecta novas emissões no observable como alterações do registros atuais para não duplicar
        // e inclusão de novos registro para o topo da lista. não detecta exclusão.
        const notices = Object.values(
          // prettier-ignore
          [...acc, ...val].reduce((acm, item) => ({ ...acm, [item.dateCreated]: item }), {} as Notices)
        ).sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        );

        // tratamento para exclusões, eliminar do array o indice excluído pela tela
        if (this.deletedIndex > -1) {
          notices.splice(this.deletedIndex, 1);
          this.deletedIndex = undefined;
        }
        return notices;
      })
    );
  }

  /*
   * Reliza carga incremental dos registros das notícias. A cada chamada desta função o subject emite uma nova pagina de registros
   * que será concatenada com a lista atual. Também emite quando alguma registro é alterado ou incluído.
   * */
  loadNotices() {
    this.noticesSubscription = this.noticesService
      .getAllPublicNotices(
        this.profileService.profile.id,
        this.limit,
        this.lastVisible
      )
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar as notícias: ', error.message);
          this.infiniteScroll.complete();
          this.disableInfinite$.next(true);
          this.loadingError$.next(true);
          return EMPTY;
        })
      )
      .subscribe((notice) => {
        // console.log(notice);
        if (!notice) {
          // não existem mais registros para trazer
          this.disableInfinite$.next(true);
          this.disableInfinite$.complete();
          return;
        }
        // guarda chave do ultimo registro
        this.lastVisible = notice[notice.length - 1].dateCreated;

        // faz o observable emitir uma nova página que será concatenada com a lista atual
        this.noticesPage$.next(notice);

        // tratando a chamada feita pelo ngOnInit quando infinite scroll ainda não tiver sido instanciado.
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
        }
      });
  }

  getIssues() {
    // this.issues = this.noticesProvider.incident(this.authProvider.getUser().uid, 'private');
  }

  // evita que toda a lista de notícias seja recarregada quando um unico card é alterado / dado like
  noticesTrackBy(index, item) {
    return item.id;
  }

  // registra o like ou unlike dado pelo usuário na notícia
  like(noticeId: string, isLiked: boolean) {
    this.noticesService.likeUnlike(
      noticeId,
      this.profileService.profile.id,
      isLiked
    );
  }

  async deleteNotice(noticeId: string, index: number, imgUrl: string[]) {
    const confirm = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: `<p> Deseja realmente excluir esta notícia?</p>`,
      buttons: [
        {
          text: 'Excluir',
          cssClass: 'danger',
          handler: async () => {
            await this.noticesService.deleteNotice(noticeId);
            this.deletedIndex = index;

            imgUrl.forEach((img) => deleteObject(ref(this.storage, img)));
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

  async openImgModal(title: string, imgUrls: string[]) {
    const modal = await this.modalCtrl.create({
      component: NoticeImageViewPage,
      componentProps: {
        title,
        imgUrls,
      },
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.noticesSubscription.unsubscribe();
    console.log('destroy home');
  }
}
