import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GasBill } from '../models/utility.interface';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private firestore: Firestore) {}

  // retorna leitura de gás de um apartamento de um determinado mês
  getGasBill(residentId: string, referenceDate: string): Observable<GasBill> {
    return docData<GasBill>(
      doc(
        this.firestore,
        'gasBill',
        `${referenceDate}_${residentId}`
      ) as DocumentReference<GasBill>
    );
  }

  // salva na base o consumo de gás de cada apartamento
  saveGasBill(referenceDate: string, gasBills: Array<GasBill>): Promise<void> {
    const batch = writeBatch(this.firestore);

    gasBills.forEach((gasBill) => {
      if (gasBill.gas) {
        gasBill.referenceDate = referenceDate;
        batch.set(
          doc(this.firestore, `gasBill/${referenceDate}_${gasBill.residentId}`),
          gasBill
        );
      }
    });

    return batch.commit();
  }

  updateGasBill(
    referenceDate: string,
    gasBills: Array<GasBill>
  ): Promise<void> {
    const batch = writeBatch(this.firestore);

    gasBills.forEach((gasBill) => {
      batch.set(
        doc(this.firestore, `gasBill/${referenceDate}_${gasBill.residentId}`),
        gasBill,
        {
          merge: true,
        }
      );
    });

    return batch.commit();
  }
}
