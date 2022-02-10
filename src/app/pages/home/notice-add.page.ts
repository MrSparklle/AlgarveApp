import { Component, OnInit, NgZone } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { NoticeService } from 'src/app/services/notice.service';
import {
  Camera,
  CameraSource,
  CameraResultType,
  CameraDirection,
} from '@capacitor/camera';
import {
  ref,
  uploadString,
  Storage,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-notice-add',
  templateUrl: './notice-add.page.html',
  styleUrls: ['./notice-add.page.scss'],
})
export class NoticeAddPage implements OnInit {
  public noticeForm: FormGroup;
  public isIos = this.platform.is('ios');
  public imgCarousel: string[] = new Array(4);

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    public profileService: ProfileService,
    private noticeService: NoticeService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private ngZone: NgZone,
    private storage: Storage
  ) {}

  ngOnInit() {
    // criando formulário e suas validações
    this.noticeForm = this.formBuilder.group({
      title: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      text: ['', Validators.required],
      imgUrl: [''],
      from: this.formBuilder.group({
        id: this.profileService.profile.id,
      }),
      dateCreated: format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`),
      type: 'private',
    });
    console.log(this.noticeForm);
  }

  // ao clicar no toggle de publicar
  togglePublicar(ev) {
    this.noticeForm.controls.type.setValue(
      ev.detail.checked ? 'public' : 'private'
    );
  }

  // remove para ela não ser enviada quando a notícia for salva
  removePicture(i) {
    this.imgCarousel[i] = null;
  }

  // salva a nova notícia
  async addNotice() {
    if (this.noticeForm.valid) {
      const loader = await this.loadingCtrl.create({});
      await loader.present();

      const imgUrls = Array<string>();

      // percorrer o array de imagens e fazer o ulpload de cada uma.
      // filter remove posições do array vazias
      for (const img of this.imgCarousel.filter((n) => n)) {
        const taskUpload = await uploadString(
          ref(
            this.storage,
            `/notices/${
              Date.now().toString(36) + Math.random().toString(36).substring(2)
            }.jpg`
          ),
          img,
          'data_url'
        );
        imgUrls.push(await getDownloadURL(taskUpload.ref));
      }

      this.noticeForm.controls.imgUrl.setValue(imgUrls);

      // salvando os dados da notícia e voltando pra home
      try {
        await this.noticeService.addNotice(this.noticeForm.value);
        this.router.navigate(['/tabs/home']);
        this.noticeForm.reset();
      } catch (error) {
        console.error(error);
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Não foi possível adicionar a notícia.',
          buttons: ['OK'],
        });
        await alert.present();
      } finally {
        await loader.dismiss();
      }
    }
  }

  async selectPicture(position: number) {
    const options = {
      quality: 75,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
      direction: CameraDirection.Front,
      saveToGallery: false,
      allowEditing: false,
      width: 800,
      height: 600,
    };

    try {
      const image = await Camera.getPhoto(options);
      // handler isn't being run inside an ngZone so angular's change detection doesn't pick it up
      // the click you do afterwards does trigger angular to run change detection
      // console.log(image.dataUrl);
      this.ngZone.run(() => (this.imgCarousel[position] = image.dataUrl));

    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Câmera Indisponível',
        message:
          'Não foi possível acessar a câmera do seu dispositivo, conceda permissão de acesso a câmera para o aplicativo',
        buttons: ['OK'],
      });
      return await alert.present();
    }
  }
}
