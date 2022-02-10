import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionChanges,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  docSnapshots,
  DocumentReference,
  Firestore,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from '@angular/fire/firestore';
import { map, mergeMap, switchMap, take, defaultIfEmpty } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Profile } from '../models/profile.interface';
import { Notices } from '../models/notices.interface';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  constructor(private firestore: Firestore) {}

  getAllPublicNotices(
    profileId: string,
    noticesLimit: number,
    lastVisible: Notices
  ): Observable<any[]> {
    // retorna todas as notícias públicas
    // console.log('getAllPublicNotices', lastVisible);

    return collectionData<Notices>(
      query(
        collection(this.firestore, 'notices') as CollectionReference<Notices>,
        where('type', '==', 'public'),
        orderBy('dateCreated', 'desc'),
        startAfter(lastVisible),
        limit(noticesLimit)
      ),
      { idField: 'id' }
    ).pipe(
      map((actions: Notices[]) =>
        actions.map((notice: Notices) =>
          // retorna os dados do usuário que postou a notícia (from.id)
          docData<Profile>(
            doc(
              this.firestore,
              'profile',
              notice.from.id
            ) as DocumentReference<Profile>
          ).pipe(
            take(1),
            switchMap((snapProfile: Profile) =>
              // retorna se o usuario logado ja deu ou não like em uma notícia para mostrar o botão like em cor diferenciada
              docData(
                doc(this.firestore, 'likes', `${notice.id}_${profileId}`)
              ).pipe(
                take(1),
                map((like) => ({ ...notice, profile: snapProfile, like }))
              )
            )
          )
        )
      ),
      mergeMap((result) =>
        // retornar o defaultempty para emitir nulo quando query não retornar mais registros
        // caso contrário observable fica preso eternamente
        combineLatest(result).pipe(defaultIfEmpty(null))
      )
    );
  }

  likeUnlike(
    noticeId: string,
    profileId: string,
    liked: boolean
  ): Promise<void> {
    return setDoc(doc(this.firestore, `likes/${noticeId}_${profileId}`), {
      noticeId,
      profileId,
      liked,
    });
  }

  addNotice(notice: Notices): Promise<DocumentReference> {
    return addDoc(collection(this.firestore, 'notices'), notice);
  }

  updateNotice(id: string, notice: Notices) {
    return setDoc(doc(this.firestore, `/notices/${id}`), notice, {
      merge: true,
    });
  }

  deleteNotice(noticeId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `/notices/${noticeId}`));
  }

  getNotice(noticeId: string): Observable<Notices> {
    return docSnapshots<Notices>(
      doc(this.firestore, `/notices/${noticeId}`) as DocumentReference<Notices>
    ).pipe(map((snap) => ({ id: snap.id, ...(snap.data() as Notices) })));
  }
}
