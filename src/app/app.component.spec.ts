import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

describe('AppComponent', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(
    waitForAsync(() => {
      statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
      platformReadySpy = Promise.resolve();
      platformSpy = jasmine.createSpyObj('Platform', {
        ready: platformReadySpy,
      });

      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          IonicStorageModule.forRoot(),
          AngularFireModule.initializeApp(environment.firebaseConfig),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: StatusBar, useValue: statusBarSpy },
          { provide: Platform, useValue: platformSpy },
        ],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // TODO: add more tests!
});
