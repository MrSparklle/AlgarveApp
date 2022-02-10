import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavParams } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';

import { DocumentViewPDFPage } from './document-view-pdf.page';

describe('DocumentViewPDFPage', () => {
  let component: DocumentViewPDFPage;
  let fixture: ComponentFixture<DocumentViewPDFPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [UrlSerializer, NavParams],
        declarations: [DocumentViewPDFPage],
        imports: [AppModule, RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewPDFPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
