import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from 'src/app/app.module';

import { BookingDetailPage } from './booking-detail.page';

describe('BookingDetailPage', () => {
  let component: BookingDetailPage;
  let fixture: ComponentFixture<BookingDetailPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [ActivatedRoute],
        declarations: [BookingDetailPage],
        imports: [AppModule, RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
