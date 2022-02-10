import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentViewPDFPage } from './document-view-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentViewPDFPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PdfViewerModule, RouterModule.forChild(routes)],
  declarations: [DocumentViewPDFPage]
})
export class DocumentViewPDFPageModule {}
