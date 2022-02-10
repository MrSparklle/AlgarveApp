import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToastController,
  ActionSheetController,
  LoadingController,
  AlertController,
  Platform,
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  deleteObject,
  ref,
  Storage,
  uploadString,
  getDownloadURL,
} from '@angular/fire/storage';
import {  tap } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.interface';
import { Observable } from 'rxjs';
import {
  Camera,
  CameraSource,
  CameraResultType,
  CameraDirection,
} from '@capacitor/camera';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  public profile: Observable<Profile>;
  public profileId: string;
  public profileForm: FormGroup;
  public cameraAvatar: string;
  public isIos = this.platform.is('ios');
  private pictureDeleted = false;

  constructor(
    private platform: Platform,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.profileId = this.route.snapshot.paramMap.get('profileId');

    // criando formulário vazio e suas validações (só valores que serão atualizados)
    this.profileForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]),
      ],
      avatarUrl: [],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('\\([0-9]{2}\\) [0-9]{4}-[0-9]{4}$'),
        ],
      ],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern('\\([0-9]{2}\\) 9[0-9]{4}-[0-9]{4}$'),
        ],
      ],
      facebook: ['', Validators.maxLength(20)],
      instagram: ['', Validators.maxLength(20)],
      twitter: ['', Validators.maxLength(20)],
    });

    // lendo os dados do usuário de forma asyncrona e em seguida faz patch delas pro formulário
    this.profile = this.profileService
      .getProfile(this.profileId)
      .pipe(tap((profile) => this.profileForm.patchValue(profile)));
  }

  async saveProfile() {
    console.log('salvando');
    // se os dados do formulário são válidos
    if (this.profileForm.valid) {
      const loader = await this.loadingCtrl.create({});
      await loader.present();

      const path = `/profile/${this.profileId}.jpg`;

      // se o usuário optou por excluir sua foto
      if (this.pictureDeleted) {
        deleteObject(ref(this.storage, path));
        this.profileForm.controls.avatarUrl.setValue(null);
      } else if (this.cameraAvatar) {
        // se usuário está atualizando sua foto
        const taskUpload = await uploadString(
          ref(this.storage, path),
          this.cameraAvatar,
          'data_url'
        );

        this.profileForm.controls.avatarUrl.setValue(
          await getDownloadURL(taskUpload.ref)
        );
      }

      try {
        // atualiza os dados do usuário
        await this.profileService.updateProfile(
          this.profileId,
          this.profileForm.value
        );

        // mostra mensagem de dados foram salvos com sucesso
        const toast = await this.toastCtrl.create({
          message: 'Dados salvos com sucesso',
          duration: 3000,
        });
        await toast.present();

        // volta para página de profile do usuário
        this.router.navigate(['/tabs/profile']);
      } catch (error) {
        alert(
          'Não foi possível salvar as informações, tente novamente mais tarde'
        );
        console.error(error);
      } finally {
        await loader.dismiss();
      }
    }
  }

  async selectPicture() {
    // abre actionshet para determinar se a foto será da galeria ou da camera
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Foto com a Câmera',
          icon: 'camera',
          handler: () => {
            // console.log('CAMERA SOURCE: ', CameraSource.Camera);
            this.getPicture(CameraSource.Camera);
          },
        },
        {
          text: 'Escolher da Galeria',
          icon: 'images',
          handler: () => {
            this.getPicture(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    return await actionSheet.present();
  }

  // abre a camera ou biblioteca pro usuário selecionar a foto de perfil
  async getPicture(source: CameraSource): Promise<void> {
    const options = {
      quality: 75,
      source,
      resultType: CameraResultType.DataUrl,
      direction: CameraDirection.Front,
      saveToGallery: false,
      allowEditing: false,
      height: 500,
      width: 500,
    };

    try {
      const image = await Camera.getPhoto(options);
      // handler isn't being run inside an ngZone so angular's change detection doesn't pick it up
      // the click you do afterwards does trigger angular to run change detection
      // console.log(image.dataUrl);
      this.ngZone.run(() => (this.cameraAvatar = image.dataUrl));
      // this.cameraAvatar = image.base64String;
      // this.cameraAvatar = image.webPath;

      // this.profileForm.patchValue({ avatarImg: 'data:image/jpg;base64,' + imageData });
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

  // exclui a foto do perfil e deleta do firestorage
  deletePicture() {
    this.cameraAvatar = null;
    this.profileForm.controls.avatarUrl.setValue(null);
    this.pictureDeleted = true;
  }
}
