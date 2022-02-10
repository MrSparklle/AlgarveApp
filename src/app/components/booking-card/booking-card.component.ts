import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Booking } from 'src/app/models/booking.interface';
import {
  LoadingController,
  ActionSheetController,
  ToastController,
} from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';
import { addDays, toDate, format, parseISO } from 'date-fns';
import { Resources } from '../../services/core/utils/resources';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent {
  @Input()
  booking: Booking;
  @Output()
  bookingDeleted = new EventEmitter<string>();

  public profile = this.profileService.profile;
  public today = format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`);

  constructor(
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private router: Router,
    private bookingService: BookingService,
    public profileService: ProfileService
  ) {}

  // abre actionshet para ações sobre a reserva como excluir ou editar
  async presentActionSheet(userBooking: Booking) {
    const opts = {
      header: 'Gerencie suas Reservsas',
      buttons: [
        {
          text: 'Excluir Reserva',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteBooking(userBooking);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    };

    if (this.profileService.checkAuthorization(this.profile, ['sindico'])) {
      opts.buttons.push({
        text: 'Editar Reserva',
        role: '',
        icon: 'create-outline',
        handler: () => {
          this.router.navigate([
            `/tabs/booking/booking-edit/${userBooking.id}`,
          ]);
        },
      });
    }

    const actionSheet = await this.actionSheetCtrl.create(opts);

    await actionSheet.present();
  }

  // realiza exclusão da reserva
  async deleteBooking(userBooking: Booking): Promise<void> {
    // so permitir excluir a reversa até no máximo no dia anterior a data da reserva
    if (
      toDate(parseISO(userBooking.dateBooking)) >
      addDays(new Date(), Resources.Constants.MAXDIASCANCELARESERVA)
    ) {
      const loader = await this.loadingCtrl.create({
        message: 'Excluindo Reserva...',
      });
      await loader.present();

      // excluindo a reserva
      try {
        // emite evento externo informando que a reserva foi excluída
        // não pode ser depois, pois quando exclui a reseva, o componente deixa de existir e o emit não faz nada
        this.bookingDeleted.emit(userBooking.id);
        await this.bookingService.deleteBooking(userBooking);
      } catch (error) {
        console.error(error);
        const toastError = await this.toastCtrl.create({
          message: 'Não foi possível excluir a reserva',
          position: 'top',
          duration: 3000,
        });
        return await toastError.present();
      } finally {
        loader.dismiss();
      }

      const toastSucess = await this.toastCtrl.create({
        message: 'Reserva excluída com sucesso',
        position: 'top',
        duration: 3000,
      });
      return await toastSucess.present();
    } else {
      // se não for possível excluir a reserva devido ao prazo expirado
      const toast = await this.toastCtrl.create({
        message: `Você não pode excluir esta reserva. 
        O prazo máximo para exclusão é de até ${Resources.Constants.MAXDIASCANCELARESERVA} dia(s) antes da data da reserva.`,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      });
      // mostra mensagem de erro ao usuário
      return await toast.present();
    }
  }
}
