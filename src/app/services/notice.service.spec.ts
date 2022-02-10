import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { NoticeService } from './notice.service';

describe('NoticeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoticeService],
      imports: [AppModule],
    });
  });

  it('should be created', inject([NoticeService], (service: NoticeService) => {
    expect(service).toBeTruthy();
  }));
});
