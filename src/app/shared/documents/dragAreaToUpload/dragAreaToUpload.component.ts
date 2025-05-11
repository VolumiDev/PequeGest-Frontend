import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { DocumentsService } from '../../../services/documents/documents.service';
import { catchError, of, take, tap } from 'rxjs';

@Component({
  selector: 'app-drag-area-to-upload',
  imports: [],
  templateUrl: './dragAreaToUpload.component.html',
})
export class DragAreaToUploadComponent {
  @Input() isMultiple: boolean = true;
  @Input() description: string = 'Arrastra aquí tus documentos';
  @Input() acceptedFile: string = '';
  @Input() buttonContent: string = 'Seleccionar archivos';
  @Input() listLegend: string = 'Archivos seleccionados:';
  @Input() userType: string = 'student';
  @Input() targetHash: string = '';

  @Output() rechargeDocsEvent = new EventEmitter<void>();

  docService = inject(DocumentsService);

  tempFiles = signal<string[]>([]);

  listExist: boolean = true;
  files: File[] = [];
  isDragOver: boolean = false;

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        this.files.push(fileList.item(i)!);
      }
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files) {
      const droppedFiles = event.dataTransfer.files;

      for (let i = 0; i < droppedFiles.length; i++) {
        const file = droppedFiles.item(i);

        if (file) {
          this.files.push(file);
        }
      }
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onSubmitDocs() {
    this.docService
      .uploadDocs(this.targetHash, this.userType, this.files)
      .pipe(
        take(1),
        tap(() => this.rechargeDocsEvent.emit()),
        catchError((err) => {
          console.log('Ocurrio un error', err);
          return of([]);
        })
      )
      .subscribe();
  }
}
