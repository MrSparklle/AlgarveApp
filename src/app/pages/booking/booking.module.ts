import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingPage } from './booking.page';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: BookingPage,
  },
  {
    path: 'booking-add',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../booking/booking-add.module').then(
            (m) => m.BookingAddPageModule
          ),
      },
    ],
  },
  {
    path: 'booking-edit/:bookingId',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../booking/booking-edit.module').then(
            (m) => m.BookingEditPageModule
          ),
      },
    ],
  },
  {
    path: 'booking-detail/:bookingId',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./booking-detail.module').then(
            (m) => m.BookingDetailPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
  ],
  declarations: [BookingPage],
})
export class BookingPageModule {}
