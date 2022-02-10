import { Component, Input } from '@angular/core';
import { Profile } from '../../models/profile.interface';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input()
  profile: Profile;

  constructor() {}

  async navigateTo(url: string): Promise<void> {
    await Browser.open({ url: url });
  }
}
