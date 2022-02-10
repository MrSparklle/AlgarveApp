import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from 'src/app/app.module';

import { NoticeAddPage } from './notice-add.page';

describe('NoticeAddPage', () => {
  let component: NoticeAddPage;
  let fixture: ComponentFixture<NoticeAddPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [FormBuilder],
        declarations: [NoticeAddPage],
        imports: [AppModule, RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
