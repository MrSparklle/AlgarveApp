import { ErrorHandler, Injectable } from '@angular/core';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CrashlyticsErrorHandlerService extends ErrorHandler {
  constructor() {
    super();
  }

  async handleError(error: any): Promise<void> {
    if (!environment.production) {
      super.handleError(error);
    } else {
      try {
        await FirebaseCrashlytics.recordException({
          message: `Ocorreram os seguintes erros no APP:\n ${error}`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
