import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SindicoGuard } from '../../guards/sindico.guard';

import { IonicModule } from '@ionic/angular';

import { ResidentPage } from './resident.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentPage
  },
  {
    path: 'resident-detail/:residentId',
    children: [
      {
        path: '',
        loadChildren: () => import('./resident-detail.module').then(m => m.ResidentDetailPageModule)
      }
    ]
  },
  {
    path: 'gas-bill',
    children: [
      {
        path: '',
        loadChildren: () => import('./utility/gas-bill/gas-bill.module').then(m => m.GasBillPageModule)
      }
    ],
    canActivate: [SindicoGuard]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ResidentPage]
})
export class ResidentPageModule {}
