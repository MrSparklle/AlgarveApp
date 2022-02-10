import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from 'src/app/app.module';

import { ProfileEditPage } from './profile-edit.page';

describe('ProfileEditPage', () => {
  let component: ProfileEditPage;
  let fixture: ComponentFixture<ProfileEditPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [FormBuilder],
        declarations: [ProfileEditPage],
        imports: [AppModule, RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
