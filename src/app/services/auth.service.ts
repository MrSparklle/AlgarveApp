import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  // verifica se está autenticado no firebase, caso positivo retorna observable com dados do profile deste usuário
  // caso contrário retorna um observable vazio
  // getAuthenticatedUser(): Observable<Profile> {
  //   return this.afAuth.authState.pipe(
  //     switchMap(user => {
  //       if (user) {
  //         return this.profileService.getProfile(user.uid);
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   );
  // }

  // retorna objeto firebase:User com todos dados do usuário autenticado
  async getUser(): Promise<any> {
    return this.auth.currentUser;
  }

  // realiza a validação do login do usuário
  loginUser(email: string, password: string): Promise<UserCredential> {
    // return this.auth.signInWithEmailAndPassword(email, password);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // efetua o logout do usuário logado no firebase
  logoutUser(): Promise<any> {
    return this.auth.signOut();
  }
}
