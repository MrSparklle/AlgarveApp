import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  getDocs,
  QueryConstraint,
  setDoc,
  where,
  collectionChanges,
} from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Booking } from '../models/booking.interface';
import { format, addYears } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private firestore: Firestore) {}

  // retorna todos as reservas de um determinado usuário
  getUserBookings(user: string, history?: boolean): Observable<Booking[]> {
    return collectionData<Booking>(
      query<Booking>(
        collection(this.firestore, 'booking') as CollectionReference<Booking>,
        where('profile.id', '==', user),
        where('dateBooking', '>=', this.startDate(history)),
        orderBy('dateBooking', 'desc')
      ),
      { idField: 'id' }
    );
  }

  // retorna todas as reservas de todos os usuários
  getAllBookings(history?: boolean): Observable<Booking[]> {
    const ascdesc = history ? 'desc' : 'asc';

    return collectionData<Booking>(
      query<Booking>(
        collection(this.firestore, 'booking') as CollectionReference<Booking>,
        where('dateBooking', '>=', this.startDate(history)),
        where('dateBooking', '<=', this.endDate(history)),
        orderBy('dateBooking', ascdesc)
      ),
      { idField: 'id' }
    );
  }

  // retorna a quantidade de reservas ativas na data de hoje
  getAllCountBookings(): Observable<Booking[]> {
    return collectionData<Booking>(
      query<Booking>(
        collection(this.firestore, 'booking') as CollectionReference<Booking>,
        where(
          'dateBooking',
          '>=',
          format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`)
        )
      )
    );
  }

  updateBooking(id: string, booking: Booking) {
    return setDoc(doc(this.firestore, `/booking/${id}`), booking, {
      merge: true,
    });
  }

  // adiciona nova reserva no banco
  addBooking(booking: Booking): Promise<DocumentReference> {
    return addDoc(collection(this.firestore, 'booking'), booking);
  }

  // verifica se já existe reserva para o dia / período informado
  existBooking(
    dateBooking: string,
    period: string[],
    bookingId?: string
  ): Observable<any> {
    // o id é opcional, só é usando quando vai editar uma reserva, pois no insert o id não existe na collection
    const constraints: QueryConstraint[] = bookingId
      ? [where('__name__', '!=', bookingId)]
      : [];

    return collectionData<Booking>(
      query<Booking>(
        collection(this.firestore, 'booking') as CollectionReference<Booking>,
        where('dateBooking', '==', dateBooking),
        where('period', 'array-contains-any', period),
        ...constraints
      ),
      { idField: 'id' }
    ).pipe(
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
      take(1)
    );
  }

  // retorna uma única reserva com ID
  getBookig(bookingId: string): Observable<Booking> {
    return docData<Booking>(
      doc(this.firestore, `booking`, bookingId) as DocumentReference<Booking>,
      { idField: 'id' }
    );
  }

  // exclui uma reserva
  deleteBooking(booking: Booking): Promise<void> {
    return deleteDoc(doc(this.firestore, `/booking/${booking.id}`));
  }

  // retorna todas as regras ativas para reserva
  getRulesBooking(): Observable<DocumentData[]> {
    return collectionData(
      query(
        collection(this.firestore, 'bookingrules'),
        where('active', '==', true),
        orderBy('seq')
      ),
      { idField: 'id' }
    );
  }

  // retorna data inicial da consulta quando é ou não histórico
  // se for histórico a data inicial será a data atual menos 1 ano, senão a data inicial é a data atual.
  private startDate(history: boolean): string {
    return history
      ? format(addYears(new Date(), -1), `yyyy-MM-dd'T'HH:mm:ssxxx`)
      : format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`);
  }

  // retorna data final da consulta quando é ou não histórico
  // se for histórico a data final será a data atual, senão será uma data futura
  private endDate(history: boolean): string {
    return history
      ? format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`)
      : '2099-12-31';
  }
}
