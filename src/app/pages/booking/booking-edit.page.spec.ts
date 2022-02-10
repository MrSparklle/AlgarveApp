import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';

import { BookingEditPage } from './booking-edit.page';

describe('BookingEditPage', () => {
  let component: BookingEditPage;
  let fixture: ComponentFixture<BookingEditPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BookingEditPage],
        providers: [FormBuilder],
        imports: [IonicModule.forRoot(), AppModule, RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(BookingEditPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
