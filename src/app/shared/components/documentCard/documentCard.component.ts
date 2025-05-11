import { Component, inject, Input } from '@angular/core';
import { Document } from '../../../interfaces/Document.interface';
import { environment } from '../../../../environment/enviroment';
import { DocumentsService } from '../../../services/documents/documents.service';
import { catchError, of, take, tap } from 'rxjs';

@Component({
  selector: 'app-document-card',
  imports: [],
  templateUrl: './documentCard.component.html',
})
export class DocumentCardComponent {
  @Input() doc?: Document;
  documentServices = inject(DocumentsService);

  readonly domain: string = environment.baseUrl;

  imgFormats: string[] = ['png', 'jpeg', 'webp', 'jpg', 'svg'];

  showDoc() {
    window.open(`${this.domain}${this.doc?.path}`);
  }

  downloadDoc() {
    this.documentServices
      .downloadDocByHash(this.doc?.hash!)
      .pipe(
        take(1),
        catchError((err) => {
          console.log('Ocurrio un error', err);
          return of();
        }),
        tap((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = this.doc?.fileName!;
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        })
      )
      .subscribe();
  }
}
