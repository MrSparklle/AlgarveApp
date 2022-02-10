import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
      imports: [AppModule],
    });
  });

  it('should be created', inject(
    [StorageService],
    (service: StorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
