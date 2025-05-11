import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DragAreaToUploadComponent } from '../../../../../../../shared/documents/dragAreaToUpload/dragAreaToUpload.component';
import { DocumentsService } from '../../../../../../../services/documents/documents.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { Document } from '../../../../../../../interfaces/Document.interface';
import { DocumentCardComponent } from '../../../../../../../shared/components/documentCard/documentCard.component';

@Component({
  selector: 'app-students-documents-list',
  imports: [DragAreaToUploadComponent, DocumentCardComponent],
  templateUrl: './studentsDocumentsList.component.html',
})
export class StudentsDocumentsListComponent implements OnInit {
  ngOnInit(): void {
    this.activatedRoute.parent?.paramMap.subscribe((params) => {
      this.studentHash = params.get('studentHash')!;
    });

    this.getDocsByStudentHash(this.studentHash);
  }

  studentHash: string = '';
  activatedRoute = inject(ActivatedRoute);
  docService = inject(DocumentsService);

  docs = signal<Document[]>([]);

  getDocsByStudentHash(hash: string) {
    this.docService
      .getDocsByStudentHash(hash)
      .pipe(
        tap((base) => {
          this.docs.set(Array.from(base.content));
          console.log(this.docs());
        }),
        catchError((err) => {
          console.log('Ocurrio un error', err);
          return of([]);
        })
      )
      .subscribe();
  }
}
