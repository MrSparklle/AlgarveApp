import { ErrorHandler, Injectable } from '@angular/core';
// import * as Sentry from 'sentry-cordova';
import { environment } from '../../../../environments/environment';
import { Resources } from '../utils/resources';

try {
  // Sentry.init(Resources.Constants.SENTRY);
} catch (err) {
  console.error('Sentry não inicializado', err);
}

@Injectable()
export class SentryErrorHandlerService extends ErrorHandler {
  handleError(error: any): void {
    if (!environment.production) {
      super.handleError(error);
    } else {
      try {
        // Sentry.captureException(error.originalError || error);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
