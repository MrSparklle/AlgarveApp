import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService],
      imports: [AppModule],
    });
  });

  it('should be created', inject(
    [ProfileService],
    (service: ProfileService) => {
      expect(service).toBeTruthy();
    }
  ));
});
