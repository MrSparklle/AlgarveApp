import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from 'src/app/app.module';

import { BookingAddPage } from './booking-add.page';

describe('BookingAddPage', () => {
  let component: BookingAddPage;
  let fixture: ComponentFixture<BookingAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingAddPage],
      providers: [FormBuilder],
      imports: [AppModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
