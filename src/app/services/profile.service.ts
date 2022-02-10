import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.interface';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { AuthService } from './auth.service';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import {
  collection,
  collectionChanges,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  docSnapshots,
  DocumentChange,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProfileService implements Resolve<any> {
  profile: Profile = {} as Profile;
  private currentToken: string;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  // utilizado no arquivo de rotas das tabs
  // garante que os dados do usuário logado serão carregados na propriedade _profile dessa classe antes de qualquer rota ser carregada
  async resolve() {
    const userId = (await this.authService.getUser()).uid;
    this.profile = await firstValueFrom(this.getProfile(userId));
    console.log('Dados de profile carregados', userId);

    FirebaseCrashlytics.setUserId({
      userId,
    });
  }

  // retorna os dados do usuário passado como parâmnetro. Não usar take(1) senão o sistema da unsubscribe
  // e as atualiações feitas no profile não são replicadas em tempo real no app
  getProfile(userId: string): Observable<Profile> {
    return docData<Profile>(
      doc(this.firestore, 'profile', userId) as DocumentReference<Profile>,
      { idField: 'id' }
    );
  }

  updateProfile(userId: string, profile: Profile): Promise<void> {
    return setDoc(doc(this.firestore, `/profile/${userId}`), profile, {
      merge: true,
    });
  }

  getAllProfiles(onlySuites?: boolean): Observable<Profile[]> {
    const whereSuites = onlySuites ? 0 : -1;

    return collectionData<Profile>(
      query<Profile>(
        collection(this.firestore, 'profile') as CollectionReference<Profile>,
        where('suite', '>', whereSuites),
        orderBy('suite')
      ),
      { idField: 'id' }
    );
  }

  // adiciona ou atualiza todos os tokens dos dispositivos do usuário
  async saveToken(userId: string): Promise<void> {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this.currentToken = token.value;
      if (this.currentToken && userId) {
        // o valor está indo {} pois só importa a chave/token, não o conteudo
        return setDoc(
          doc(this.firestore, `profile/${userId}/token/${token.value}`),
          {}
        );
      }
    });

    // const token = await this.fcm.getToken();
    // this._currentToken = token;
    // // insere ou atualiza o token do aparelho do usuário
    // if (this._currentToken && userId) {
    //   return this.afs.doc(`profile/${userId}/token/${token}`).set({});
    // }
  }

  // exclui o token do usuario da base
  deleteToken(profileId: string): Promise<void> {
    if (this.currentToken && profileId) {
      deleteDoc(
        doc(this.firestore, `profile/${profileId}/token/${this.currentToken}`)
      );
    } else {
      return null;
    }
  }

  checkAuthorization(profile: Profile, allowedRoles: string[]): boolean {
    if (!profile.roles) {
      return false;
    }

    for (const role of allowedRoles) {
      if (profile.roles[role]) {
        return true;
      }
    }
    return false;
  }
}
