import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LikeComponent } from './like/like.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { TruncatedTextComponent } from './truncated-text/truncated-text.component';
import { PipesModule } from '../pipes/pipes.module';
import { BookingCardComponent } from './booking-card/booking-card.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LikeComponent,
    ProfileCardComponent,
    TruncatedTextComponent,
    BookingCardComponent
  ],
  imports: [IonicModule, CommonModule, PipesModule, FormsModule],
  exports: [
    LikeComponent,
    ProfileCardComponent,
    TruncatedTextComponent,
    BookingCardComponent
  ]
})
export class ComponentsModule {}
