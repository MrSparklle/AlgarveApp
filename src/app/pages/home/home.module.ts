import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SindicoGuard } from '../../guards/sindico.guard';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { SwiperModule } from 'swiper/angular';
import { NoticeImageViewPageModule } from './notice-image-view.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'notice-add',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./notice-add.module').then((m) => m.NoticeAddPageModule),
      },
    ],
    canActivate: [SindicoGuard],
  },
  {
    path: 'notice-edit/:noticeId',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./notice-edit.module').then((m) => m.NoticeEditPageModule),
      },
    ],
    canActivate: [SindicoGuard],
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
    ComponentsModule,
    SwiperModule,
    RouterModule.forChild(routes),
    NoticeImageViewPageModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
