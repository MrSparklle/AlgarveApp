import { TestBed, async, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { SindicoGuard } from './sindico.guard';

describe('SindicoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [SindicoGuard],
    });
  });

  it('should ...', inject([SindicoGuard], (guard: SindicoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
