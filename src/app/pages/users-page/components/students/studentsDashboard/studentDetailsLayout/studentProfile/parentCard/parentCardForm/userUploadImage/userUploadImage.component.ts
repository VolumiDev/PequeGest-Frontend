import {
  Component,
  ElementRef,
  inject,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { ParentDto } from '../../../../../../../../../../interfaces/ParentDto.interface';
import { DocumentsService } from '../../../../../../../../../../services/documents/documents.service';
import { UserStudentTableService } from '../../../../../../../../../../services/student.services/usersStudentTable.service';
import { Router } from '@angular/router';
import { switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-user-upload-image',
  imports: [],
  templateUrl: './userUploadImage.component.html',
})
export class UserUploadImageComponent {
  @ViewChild('uploadCardIdDialog')
  uploadFileModal!: ElementRef<HTMLDialogElement>;

  @Input() isMultiple: boolean = true;
  @Input() description: string = 'Arrastra aquí tus documentos';
  @Input() acceptedFile: string = '';
  @Input() buttonContent: string = 'Seleccionar archivos';
  @Input() listLegend: string = 'Archivos seleccionados:';
  @Input() listExist: boolean = true;
  @Input() userType: string = 'student';
  @Input() parent: ParentDto | null = null;

  documentService = inject(DocumentsService);
  studentService = inject(UserStudentTableService);
  router = inject(Router);

  files: File[] = [];
  isDragOver: boolean = false;
  tempImages = signal<string[]>([]);

  openModal() {
    this.uploadFileModal.nativeElement.showModal();
  }

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    this.tempImages.set(imageUrls);

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

      this.tempImages.set(imageUrls);
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

  onModalClose() {
    this.files = [];
    this.tempImages.set([]);
    this.documentService.studentSelected.set(null);
    if (this.uploadFileModal && this.uploadFileModal.nativeElement) {
      this.uploadFileModal.nativeElement.close();
    }
  }

  onSubmitImageCardId() {
    if (this.files.length === 0) {
      alert('No hay ningun archivo que subir');
      return;
    }
    if (null !== this.parent) {
      if (!this.parent.hash) {
        alert('No hay studiante seleccionado');
        return;
      }
      const imageProfile = new FormData();
      imageProfile.append('file', this.files[0]);
      imageProfile.append('userHash', this.parent.hash!);

      this.documentService
        .uploadUserImageProfile(imageProfile)
        .pipe(
          take(1),
          tap(() => this.documentService.imageTimestamp.set(Date.now())),
          tap(() => this.onModalClose())
        )
        .subscribe({
          error: (error) => {
            console.log('Ocurrio un error: ', error);
          },
        });
    }
  }
}
