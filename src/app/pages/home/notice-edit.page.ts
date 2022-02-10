import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { NoticeService } from 'src/app/services/notice.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';
import { Notices } from 'src/app/models/notices.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notice-edit',
  templateUrl: './notice-edit.page.html',
  styleUrls: ['./notice-edit.page.scss'],
})
export class NoticeEditPage implements OnInit {
  public noticeForm: FormGroup;
  public isIos: boolean = this.platform.is('ios');
  public $notice: Observable<Notices>;
  public noticeId: string;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    public profileService: ProfileService,
    private noticeService: NoticeService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // recuperando parametro ID da notícia a ser editada
    this.noticeId = this.activatedRoute.snapshot.paramMap.get('noticeId');

    // criando formulário e suas validações
    this.noticeForm = this.formBuilder.group({
      title: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      text: ['', Validators.required],
      from: this.formBuilder.group({
        id: this.profileService.profile.id,
      }),
      dateUpdated: format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`),
      type: true,
    });

    this.$notice = this.noticeService
      .getNotice(this.noticeId)
      .pipe(tap((notice) => this.noticeForm.patchValue(notice)));
  }

  async saveNotice() {
    console.log('salvando');
    // se os dados do formulário são válidos
    if (this.noticeForm.valid) {
      const loader = await this.loadingCtrl.create({});
      await loader.present();

      this.noticeForm.value.type = this.noticeForm.value.type
        ? 'public'
        : 'private';

      // salvando os dados da notícia e voltando pra home
      try {
        await this.noticeService.updateNotice(
          this.noticeId,
          this.noticeForm.value
        );

        // mostra mensagem de dados foram salvos com sucesso
        const toast = await this.toastCtrl.create({
          message: 'Dados atualizados com sucesso',
          duration: 3000,
        });
        await toast.present();

        this.router.navigate(['/tabs/home']);
        this.noticeForm.reset();
      } catch (error) {
        console.error(error);
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Não foi possível salvar a notícia.',
          buttons: ['OK'],
        });
        await alert.present();
      } finally {
        await loader.dismiss();
      }
    }
  }
}
