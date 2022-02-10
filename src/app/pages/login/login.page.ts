import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private storage: Storage
  ) {}

  async doLogin() {
    if (this.loginForm.valid) {
      const loader = await this.loadingCtrl.create({});
      await loader.present();

      let firebaseUser: UserCredential;
      try {
        // realiza validação dos dados de login do usuário
        firebaseUser = await this.authService.loginUser(
          `${this.loginForm.value.suite}@residencialalgarve.com.br`,
          this.loginForm.value.password
        );
        this.storage.set('uid', firebaseUser.user.uid);
      } catch (error) {
        // caso de algum erro durante o login
        await loader.dismiss();
        let errorMessage: string;

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Email de cadastro inválido';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Usuário desabilitado';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha inválida';
            break;
          default:
            errorMessage = error;
        }

        const alert = await this.alertCtrl.create({
          header: 'Erro de Login',
          message: errorMessage,
          buttons: ['OK'],
        });

        // aborta execução da rotina caso der erro de login
        return await alert.present();
      }

      // após login valida se usuário já visualizou o tutorial
      if (await this.storage.get('hasSeenTutorial')) {
        this.router.navigate(['/tabs/home']);
      } else {
        this.router.navigate(['/tutorial']);
      }

      try {
        // salva os dados do token do aparelho do usuário recem logado
        await this.profileService.saveToken(firebaseUser.user.uid);
      } catch (error) {
        // se der erro ao recuperar o token não abortar o processo, apenas logar
        console.error(error);
      }

      return await loader.dismiss();
    }
  }

  async forgotPassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Lembrete de Senha',
      message: `A senha para acesso ao aplicativo está impressa no seu boleto de cobrança
                  enviado mensalmente. <p>A senha é por apartamento, porem mais de um morador do
                  mesmo apartamento pode efetuar login utilizando a mesma senha.
                  <p>Caso tenha dificuldades consulte seu síndico.`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      suite: [
        '',
        [Validators.required, Validators.min(10), Validators.max(99)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
