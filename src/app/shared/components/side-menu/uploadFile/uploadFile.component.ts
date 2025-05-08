import {
  Component,
  ElementRef,
  inject,
  input,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { DocumentsService } from '../../../../services/documents/documents.service';
import { switchMap, take, tap } from 'rxjs';
import { UserStudentTableService } from '../../../../services/student.services/usersStudentTable.service';
import { Router } from '@angular/router';
import { ParentDto } from '../../../../interfaces/ParentDto.interface';

@Component({
  selector: 'app-upload-file',
  imports: [],
  templateUrl: './uploadFile.component.html',
})
export class UploadFileComponent {
  @ViewChild('uploadDialog') uploadFileModal!: ElementRef<HTMLDialogElement>;

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

  tempImages = signal<string[]>([]);

  files: File[] = [];
  isDragOver: boolean = false;

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

  onSubmitImageProfile() {
    if (this.files.length === 0) {
      alert('No hay ningun archivo que subir');
      return;
    }
    if (!this.documentService.studentSelected()?.hash) {
      alert('No hay studiante seleccionado');
      return;
    }

    const imageProfile = new FormData();
    imageProfile.append('file', this.files[0]);
    imageProfile.append(
      'userHash',
      this.documentService.studentSelected()!.hash!
    );
    imageProfile.append('usertype', 'student');

    this.documentService
      .uploadStudentImageProfile(imageProfile)
      .pipe(
        take(1),
        switchMap(() => {
          return this.studentService.getAllStudents();
        }),
        tap((students) => {
          this.studentService._students.set([...students]);

          console.log('students', this.studentService._students());
          console.log('estudiantes actualizados');
        }),
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
