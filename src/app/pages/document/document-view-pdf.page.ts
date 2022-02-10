import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-document-view-pdf',
  templateUrl: './document-view-pdf.page.html',
  styleUrls: ['./document-view-pdf.page.scss'],
})
export class DocumentViewPDFPage implements OnInit {
  public zoomValue = 1;
  public title = this.navParams.get('title');
  public srcPDF = this.navParams.get('srcPDF');
  private loader: HTMLIonLoadingElement;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController
  ) {
    this.startLoading();
  }

  ngOnInit() {}

  async startLoading() {
    this.loader = await this.loadingCtrl.create({});
    await this.loader.present();
  }

  async stopLoading() {
    this.loader.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
