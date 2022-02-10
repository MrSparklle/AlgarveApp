import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [UtilityService],
    });
  });

  it('should be created', inject(
    [UtilityService],
    (service: UtilityService) => {
      expect(service).toBeTruthy();
    }
  ));
});
