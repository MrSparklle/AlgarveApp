import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { BookingService } from './booking.service';

describe('BookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingService],
      imports: [AppModule],
    });
  });

  it('should be created', inject(
    [BookingService],
    (service: BookingService) => {
      expect(service).toBeTruthy();
    }
  ));
});
