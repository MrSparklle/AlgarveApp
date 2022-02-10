import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BookingAddPageModule } from '../booking/booking-add.module';
import { BookingDetailPageModule } from '../booking/booking-detail.module';
import { BookingPageModule } from '../booking/booking.module';
import { DocumentViewPDFPageModule } from '../document/document-view-pdf.module';
import { DocumentViewPageModule } from '../document/document-view.module';
import { DocumentPageModule } from '../document/document.module';
import { HomePageModule } from '../home/home.module';
import { ProfileEditPageModule } from '../profile/profile-edit.module';
import { ProfilePageModule } from '../profile/profile.module';
import { ResidentDetailPageModule } from '../resident/resident-detail.module';
import { ResidentPageModule } from '../resident/resident.module';
import { GasBillPageModule } from '../resident/utility/gas-bill/gas-bill.module';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    ProfilePageModule,
    ProfileEditPageModule,
    BookingPageModule,
    BookingAddPageModule,
    BookingDetailPageModule,
    DocumentPageModule,
    ResidentPageModule,
    GasBillPageModule,
    DocumentViewPageModule,
    DocumentViewPDFPageModule,
    ResidentDetailPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
