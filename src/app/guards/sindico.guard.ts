import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class SindicoGuard implements CanActivate {
  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (
      !!(
        this.profileService.profile &&
        this.profileService.profile.roles &&
        this.profileService.profile.roles.sindico
      )
    ) {
      return true;
    } else {
      console.log('Usuário logado porem sem acesso acesso a role admin');
      return this.router.parseUrl('/tabs/home');
    }

    // return this.profileService.getProfile(this.profileService.profile.id).pipe(
    //   take(1),
    //   map((profile) => !!(profile && profile.roles && profile.roles.sindico)), // retorna só se for true
    //   tap((isAdmin) => {
    //     if (!isAdmin) {
    //       console.error('Acesso negado. Somente admins');
    //     }
    //   })
    // );
  }
}
