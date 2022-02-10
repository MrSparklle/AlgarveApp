import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private notificationSubscription: Subscription;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    private storage: Storage,
    private router: Router
  ) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const checkToggle = (shouldAdd: boolean) => {
      document.body.classList.toggle('dark', shouldAdd);
    };

    checkToggle(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((mediaQuery) => checkToggle(mediaQuery.matches));

    this.initializeApp();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  async initializeApp() {
    await this.storage.create();
    document.body.classList.toggle('dark', await this.storage.get('darkTheme'));

    await this.platform.ready();
    console.log('app ready');

    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#333230' });

    this.networkStatusMonitor();
    this.pushNotificationsMonitor();
  }

  async networkStatusMonitor() {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      if (!status.connected) {
        this.router.navigate(['/offline']);
      } else {
        this.router.navigate(['/tabs']);
      }
    });
  }

  async pushNotificationsMonitor() {
    if (Capacitor.getPlatform() !== 'web') {
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
          console.log(
            'Usuário não autorizou o recebimento de push notifications'
          );
        }
      });

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          const toast = await this.toastCtrl.create({
            message: JSON.stringify(notification.body),
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
              },
            ],
            position: 'top',
          });
          await toast.present();
        }
      );
    }

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // remove as notificações do badge de novas mensagens
        PushNotifications.removeAllDeliveredNotifications();
      }
    );

    // solicitando permissão para enviar notiticações
    // await this.fcm.requestPushPermission();

    // monitorando as push notifications recebidas
    // this.notificationSubscription = this.fcm
    //   .onNotification()
    //   .subscribe(async (data) => {
    //     if (!data.wasTapped) {
    //       // Notificação recebida quando app está aberto

    //       const toast = await this.toastCtrl.create({
    //         message: data.body,
    //         buttons: [
    //           {
    //             text: 'OK',
    //             role: 'cancel',
    //           },
    //         ],
    //         position: 'top',
    //       });
    //       await toast.present();
    //     }
    //   });
  }
}
