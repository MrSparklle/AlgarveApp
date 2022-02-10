import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PhoneMaskDirective } from './core/phone-mask/phone-mask.directive';

@NgModule({
  declarations: [PhoneMaskDirective],
  imports: [IonicModule, CommonModule],
  exports: [PhoneMaskDirective]
})
export class DirectivesModule {}
