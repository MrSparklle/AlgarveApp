import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';

import { NoticeEditPage } from './notice-edit.page';

describe('NoticeEditPage', () => {
  let component: NoticeEditPage;
  let fixture: ComponentFixture<NoticeEditPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [FormBuilder],
        declarations: [NoticeEditPage],
        imports: [IonicModule.forRoot(), AppModule, RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(NoticeEditPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
