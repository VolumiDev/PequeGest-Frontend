import { Component, Input, signal } from '@angular/core';

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

  tempFiles = signal<string[]>([]);

  listExist: boolean = true;
  files: File[] = [];
  isDragOver: boolean = false;

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    // Verificamos que existan archivos en el event
    if (event.dataTransfer && event.dataTransfer.files) {
      const droppedFiles = event.dataTransfer.files;
      const imageUrls: string[] = [];

      for (let i = 0; i < droppedFiles.length; i++) {
        const file = droppedFiles.item(i);

        if (file) {
          this.files.push(file);
          imageUrls.push(URL.createObjectURL(file));
        }
      }

      this.tempFiles.set(imageUrls);
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
    throw new Error('Method not implemented.');
  }
}
