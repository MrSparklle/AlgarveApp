import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable, Subject, EMPTY, combineLatest } from 'rxjs';
import { map, catchError, tap, mergeMap, take } from 'rxjs/operators';
import { startOfMonth, format, parseISO } from 'date-fns';
import { ProfileService } from '../../../../services/profile.service';
import {
  LoadingController,
  ToastController,
  AlertController,
  Platform,
} from '@ionic/angular';
import { UtilityService } from '../../../../services/utility.service';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-gas-bill',
  templateUrl: './gas-bill.page.html',
  styleUrls: ['./gas-bill.page.scss'],
})
export class GasBillPage implements OnInit {
  public gasForm: FormGroup;
  public allResident$: Observable<any>;
  public loadingError$ = new Subject<boolean>();
  public saveDisable: boolean;
  public isIos = this.platform.is('ios');

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private utilityService: UtilityService,
    private functions: Functions,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const currentMonth = format(startOfMonth(new Date()), `yyyy-MM-dd`);
    this.loadGasBill(currentMonth);
  }

  loadGasBill(referenceDate: string) {
    // inicialmente botão salvar fica desabilitado
    this.saveDisable = true;

    this.gasForm = this.formBuilder.group({
      referenceDate,
      residents: this.formBuilder.array([]),
    });
    const control = this.gasForm.controls.residents as FormArray;

    this.allResident$ = this.profileService.getAllProfiles().pipe(
      take(1),
      map((actions) =>
        actions.map((snap) => {
          // listagem de moradores
          const resident = {
            id: snap.id,
            ...snap,
          };

          // para cada morador busca o consumo de gas do mes de parametro
          return this.utilityService
            .getGasBill(resident.id, referenceDate)
            .pipe(
              take(1),
              map((gas) =>
                // retorna um observable com os moradores e sua respectiva leitura do gás do mês
                ({ ...resident, ...gas })
              )
            );
        })
      ),
      // combinando os 2 observables
      mergeMap((result) =>
        combineLatest(result).pipe(
          map((residents) =>
            // filtrando somente os perfis que são de moradores
            residents.filter((resident) => !!resident.suite)
          )
        )
      ),
      tap((residents) =>
        residents.forEach((resident) => {
          // adicionando um novo campo no formulario para cada morador
          control.push(
            this.formBuilder.group({
              residentId: [resident.id, Validators.required],
              suite: [resident.suite, Validators.required],
              createdDate: [format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`)],
              gas: [
                { value: resident.gas, disabled: resident.disabled },
                Validators.required,
              ],
            })
          );
          // caso exista pelo menos um registro ainda em aberto, habilita o botão salvar
          this.saveDisable = !resident.disabled ? false : this.saveDisable;
        })
      ),
      catchError((error) => {
        console.error('Erro ao carregar lista de Moradores: ', error);
        this.loadingError$.next(true);
        return EMPTY;
      })
    );
  }

  async saveGasBill() {
    const loader = await this.loadingCtrl.create({});
    await loader.present();

    try {
      // salva os dados da leitura do gás de todos os moradores
      await this.utilityService.saveGasBill(
        this.gasForm.value.referenceDate,
        this.gasForm.value.residents
      );
    } catch (error) {
      console.error('Erro atualizar leitura gás: ', error.message);
      const alert = await this.alertCtrl.create({
        header: 'Erro ao Salvar',
        message: `Erro ao tentar salvar os dados, tente novamente mais tarde`,
        buttons: ['OK'],
      });
      return await alert.present();
    } finally {
      await loader.dismiss();
    }

    // mostra mensagem que os dados foram salvos com sucesso
    const toast = await this.toastCtrl.create({
      message: 'Dados salvos com sucesso',
      position: 'top',
      duration: 3000,
    });
    await toast.present();

    // marca o formulário como salvo, permitindo que os dados sejam enviados por email
    this.gasForm.markAsPristine();

    // navega pra tela com a listagem dos moradores
    // this.router.navigate(['/tabs', { outlets: { resident: ['resident'] } }]);
  }

  // solicita confirmação para inclusão da reserva
  async confirmSendByMail() {
    // validar se não foi esquecido de digitar nenhuma leitura
    if (this.gasForm.valid) {
      const confirm = await this.alertCtrl.create({
        header:
          'Leitura do gás do mês de ' +
          format(parseISO(this.gasForm.value.referenceDate), 'MMMM yyyy', {
            locale: ptBR,
          }) +
          '?',
        message: `<p> Após envio para administradora não será mais possível alterar os valores.</p>
         <p> Confirmar o envio?</p>`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.sendByMail();
            },
          },
        ],
      });
      await confirm.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Leitura Incompleta',
        message: `Ainda falta realizar leitura do gás para algum morador.
                  Se não houver leitura informe valor zero e tente enviar novamente.`,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async sendByMail() {
    // validar se não foi esquecido de digitar nenhuma leitura e se todas alterações foram salvas
    if (this.gasForm.valid && !this.gasForm.dirty) {
      const loader = await this.loadingCtrl.create({});
      await loader.present();

      // mostra mensagem que os dados foram salvos com sucesso
      const toast = await this.toastCtrl.create({
        message: 'E-mail com as leituras do gás enviado com sucesso',
        position: 'top',
        duration: 3000,
      });

      // invocando https callable function do firebase para disparar email
      const sendGassBill = httpsCallableData(this.functions, 'sendGassBill');
      await sendGassBill({ referenceDate: this.gasForm.value.referenceDate })
        .pipe(
          take(1),
          tap(() => toast.present()),
          catchError(async (error) => {
            console.error(
              'Erro ao tentar enviar email da leitura do gás: ',
              error.message
            );
            const alert = await this.alertCtrl.create({
              header: 'Erro ao Enviar E-mail',
              message: `Não foi possível enviar e-mail com as leituras do gás deste mês`,
              buttons: ['OK'],
            });
            return await alert.present();
          })
        )
        .toPromise();

      // adicionando informação de desabilitado ao registros antes de atualizar
      const redidentsDisabled = this.gasForm
        .getRawValue()
        .residents.map((obj) => ({
          ...obj,
          disabled: true,
        }));

      try {
        // desabilitar alterações para o mês que está sendo enviado
        this.utilityService.updateGasBill(
          this.gasForm.value.referenceDate,
          redidentsDisabled
        );
      } catch (error) {
        console.error('Erro ao desabilitar leitura gás: ', error.message);
      } finally {
        loader.dismiss();
      }

      // desabilita botão salvar e os campos de leitura do gás de cada morador
      this.gasForm.controls.residents.disable();
      this.saveDisable = true;
    }
  }
}
