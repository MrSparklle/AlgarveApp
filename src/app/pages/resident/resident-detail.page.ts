import { Component, OnInit } from '@angular/core';
import { Profile } from '../../models/profile.interface';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.page.html',
  styleUrls: ['./resident-detail.page.scss'],
})
export class ResidentDetailPage implements OnInit {
  public resident$: Observable<Profile>;
  public profile = this.profileService.profile;
  public isIos = this.platform.is('ios');

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    public profileService: ProfileService,
  ) {}

  ngOnInit() {
    const residentId = this.route.snapshot.paramMap.get('residentId');

    // buscando as informações do morador passado como parametro
    this.resident$ = this.profileService.getProfile(residentId);
  }

  generateCrash() {
    console.log('vou gerar crash...');
    throw new Error('Bug gerado de proposito para testes');
  }

  grantSindicoRole(userId: string) {
    console.log('grantSindicoRole');

    // const callable = this.fns.httpsCallable('grantSindicoRole');
    // callable({ uid: '0000010010054', roles: { sindico: true, zelador: true } })
      // .pipe(take(1))
      // .subscribe();
  }
}
