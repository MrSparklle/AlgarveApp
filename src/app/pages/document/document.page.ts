import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import {
  collection,
  collectionChanges,
  collectionData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable, Subject, combineLatest, EMPTY, of } from 'rxjs';
import { map, mergeMap, take, catchError } from 'rxjs/operators';
import { DocumentViewPage } from './document-view.page';
import { DocumentViewPDFPage } from './document-view-pdf.page';
import { StorageService } from '../../services/storage.service';
import { Resources } from 'src/app/services/core/utils/resources';
import { FileSharer } from '@byteowls/capacitor-filesharer';

@Component({
  selector: 'app-document',
  templateUrl: './document.page.html',
  styleUrls: ['./document.page.scss'],
})
export class DocumentPage implements OnInit {
  public paperCategory$: Observable<any>;
  public loadingError$ = new Subject<boolean>();

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storageService: StorageService,
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const loader = await this.loadingCtrl.create({});
    await loader.present();
    this.paperCategory$ = collectionChanges(
      query(collection(this.firestore, 'papercategory'), orderBy('order'))
    ).pipe(
      take(1),
      map((arr) =>
        arr.map((snap) => {
          const categories = {
            id: snap.doc.id,
            ...snap.doc.data(),
          };

          return collectionData(
            query(
              collection(
                this.firestore,
                `papercategory/${categories.id}/paper`
              ),
              orderBy('datemodified', 'desc')
            ),
            { idField: 'id' }
          ).pipe(
            take(1),
            map((paper) => ({ ...categories, papers: paper }))
          );
        })
      ),
      mergeMap((result) => {
        loader.dismiss();
        if (result.length === 0) {
          return of([]);
        } else {
          return combineLatest(result);
        }
      }),
      catchError((error) => {
        loader.dismiss();
        console.error('Erro ao carregar lista de documentos: ', error);
        this.loadingError$.next(true);
        return EMPTY;
      })
    );
  }

  // realiza o download do arquivo para o dispositivo do usuário
  async downloadFile(downloadUrl: string): Promise<void> {
    if (downloadUrl) {
      const loader = await this.loadingCtrl.create({});
      await loader.present();

      // if (this.platform.is('android')) {
      //   downloadUrl = `http://docs.google.com/viewer?url=${downloadUrl}`;
      // }
      // this.iab.create(downloadUrl, '_blank', 'location=no,footer=yes,closebuttoncaption=Fechar');

      // realiza o download do arquivo pdf para o celular do usuário
      try {
        // dowload do arquivo
        const { fileBlob, fileName } = await this.storageService.downloadFile(
          downloadUrl
        );
        // gravação do arquivo no dispositivo do usuario
        await this.storageService.saveFileOnDisk(fileName, fileBlob);
      } catch (error) {
        loader.dismiss();
        console.error('Erro ao realizar download do arquivo: ', error.message);
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Erro ao realizar download do arquivo',
          buttons: ['OK'],
        });
        return await alert.present();
      } finally {
        loader.dismiss();
      }

      // mostra mensagem que o arquivo foi baixado com sucesso
      const toast = await this.toastCtrl.create({
        message: `Download realizado com sucesso para pasta ${Resources.Constants.DOWNLOAD_FOLDER}`,
        position: 'top',
        duration: 3000,
      });
      return await toast.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Download Indisponível',
        message: 'Download do arquivo indisponível',
        buttons: ['OK'],
      });
      return await alert.present();
    }
  }

  async shareFile(downloadUrl: string) {
    let base64Data: string;

    // antes de compartilhar o arquivo precisa ser baixado para pegar o conteudo base64
    const { fileBlob, fileName } = await this.storageService.downloadFile(
      downloadUrl
    );

    const reader = new FileReader();
    reader.readAsDataURL(fileBlob.body);

    reader.onloadend = async () => {
      const result = reader.result as string;
      base64Data = result.split(',')[1];

      try {
        await FileSharer.share({
          filename: fileName,
          base64Data,
          contentType: 'application/pdf',
        });
      } catch (err) {
        console.error(err);
      }
    };
  }

  // redireciona pra página de detalhes do documento com o texto do documento
  async viewDetail(
    title: string,
    text: string,
    downloadUrl: string
  ): Promise<void> {
    // se existir texto no documento abre modal pro usuário ler.
    if (text) {
      const modal = await this.modalCtrl.create({
        component: DocumentViewPage,
        componentProps: {
          title,
          text,
        },
      });
      // modal.onDidDismiss().then(data => {
      //   console.log(data);
      // });
      return await modal.present();
    } else if (downloadUrl) {
      const modal = await this.modalCtrl.create({
        component: DocumentViewPDFPage,
        componentProps: {
          title,
          srcPDF: downloadUrl,
        },
      });
      return await modal.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Texto On-Line Indisponível',
        message:
          'Deslize para o lado sobre o item para realizar o download do arquivo PDF',
        buttons: ['OK'],
      });
      return await alert.present();
    }
  }
}
