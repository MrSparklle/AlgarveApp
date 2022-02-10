import { TestBed } from '@angular/core/testing';

import { SentryErrorHandlerService } from './sentry-error-handler.service';

describe('SentryErrorHandlerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SentryErrorHandlerService],
    })
  );

  it('should be created', () => {
    const service: SentryErrorHandlerService = TestBed.get(
      SentryErrorHandlerService
    );
    expect(service).toBeTruthy();
  });
});
