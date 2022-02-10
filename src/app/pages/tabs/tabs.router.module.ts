import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { canActivate, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import {
  AuthGuard,
  redirectUnauthorizedTo,
  canActivate,
} from '@angular/fire/auth-guard';
import { TabsPage } from './tabs.page';
import { ProfileService } from 'src/app/services/profile.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    resolve: {
      profile: ProfileService,
    },
    ...canActivate(redirectUnauthorizedToLogin),
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    //
    children: [
      // Home
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      // Profiles
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      // Bookings
      {
        path: 'booking',
        loadChildren: () =>
          import('../booking/booking.module').then((m) => m.BookingPageModule),
      },
      // Documents
      {
        path: 'document',
        loadChildren: () =>
          import('../document/document.module').then(
            (m) => m.DocumentPageModule
          ),
      },
      // Residents
      {
        path: 'resident',
        loadChildren: () =>
          import('../resident/resident.module').then(
            (m) => m.ResidentPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
