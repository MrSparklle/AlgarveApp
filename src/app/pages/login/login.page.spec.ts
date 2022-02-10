import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { AuthService } from '../../services/auth.service';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let service: AuthService;

  const authStub: AuthService = jasmine.createSpyObj('authStub', [
    'getAuthInstance',
    'getRedirectResult',
  ]);

  const fireStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      },
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginPage],
        imports: [AppModule, IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          FormBuilder,
          { provide: AuthService, useValue: authStub },
          { provide: AngularFireAuth, useValue: fireStub },
          {
            provide: Router,
            useClass: class {
              navigate = jasmine.createSpy('navigate');
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    service = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
