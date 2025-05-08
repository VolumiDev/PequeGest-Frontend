import { Component, Input, signal } from '@angular/core';
import { DragAreaToUploadComponent } from '../../../../../../../shared/documents/dragAreaToUpload/dragAreaToUpload.component';

@Component({
  selector: 'app-students-documents-list',
  imports: [DragAreaToUploadComponent],
  templateUrl: './studentsDocumentsList.component.html',
})
export class StudentsDocumentsListComponent {}
