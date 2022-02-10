import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.page.html',
  styleUrls: ['./resident.page.scss'],
})
export class ResidentPage implements OnInit, OnDestroy {
  public allResidents: any[];
  public filteredResidents: any[];
  public loadingError$ = new Subject<boolean>();
  public profile = this.profileService.profile;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    public profileService: ProfileService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    // retorna todo os moradores separados por andar
    this.profileService
      .getAllProfiles()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((actions) =>
          actions.map((snap) =>
            // adicionando o número do andar a cada objeto do array
            ({
              ...snap,
              floor: Math.floor(snap.suite / 10),
            })
          )
        ),
        map((aps) =>
          // criando um array unique somente com os andares
          aps
            .filter(
              (item, pos) =>
                aps.findIndex((i) => item.floor === i.floor) === pos
            )
            .map((fltr) =>
              // para cada andar, retorna um objeto com andar + filtro com todos os apartamentos do andar
              ({
                floor: fltr.floor,
                apartments: aps.filter((apts) => apts.floor === fltr.floor),
              })
            )
        ),
        catchError((error) => {
          console.error('Erro ao carregar lista de Moradores: ', error);
          this.loadingError$.next(true);
          return EMPTY;
        })
      )
      .subscribe((resident) => {
        // console.log(JSON.stringify(resident));
        this.allResidents = resident;
        this.filteredResidents = resident;
      });
  }

  // realiza o filtro dos moradores na tela
  filterResident(evt) {

    const searchTerm = evt.srcElement.value;

    this.filteredResidents = this.allResidents.map((flors) => {
      const apartments = flors.apartments.filter(
        (aptos: any) =>
          aptos.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );

      if (apartments.length) {
        return { floor: flors.floor, apartments };
      } else {
        return {};
      }
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Leitura do Gás',
          icon: 'timer',
          handler: () => {
            this.router.navigate(['/tabs/resident/gas-bill']);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close-circle',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log('destroy resident');
  }
}
