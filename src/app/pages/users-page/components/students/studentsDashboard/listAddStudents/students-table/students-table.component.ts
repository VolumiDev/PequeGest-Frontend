import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';

import { catchError, of, take, tap } from 'rxjs';

import { DocumentsService } from '../../../../../../../services/documents/documents.service';
import { StudentDto } from '../../../../../../../interfaces/StudentDto.interface';
import { UserStudentTableService } from '../../../../../../../services/student.services/usersStudentTable.service';
import { UploadFileComponent } from '../../../../../../../shared/components/uploadFile/uploadFile.component';
import { environment } from '../../../../../../../../environment/enviroment';

@Component({
  selector: 'app-students-table',
  imports: [UploadFileComponent, RouterLink],
  templateUrl: './students-table.component.html',
})
export class StudentsTableComponent implements OnInit {
  readonly BASE_URL = environment.baseUrl;

  studentService = inject(UserStudentTableService);
  documentService = inject(DocumentsService);

  wasDelete = signal<boolean>(false);
  hasError = signal<boolean>(false);
  private _studentSelected = signal<StudentDto | null>(null);
  studentSelected = computed(() => this._studentSelected());

  imageUrl: SafeUrl | null = null;

  studentSelection(student: StudentDto) {
    this.documentService.studentSelected.set(student);
  }

  studentsLoad() {
    this.studentService
      .getAllStudents()
      .pipe(
        take(1),
        tap((students) => {
          console.log(students);
          this.studentService._students.set(students);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.studentsLoad();
  }

  setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'default-avatar.png';
  }

  deleteStudentByHash(hash: string) {
    this.studentService
      .deleteByHash(hash)
      .pipe(
        take(1),
        catchError((err) => {
          this.hasError.set(true);
          setTimeout(() => {
            this.hasError.set(false);
          }, 2000);
          console.log('Ocurrio un error', err);
          return of();
        }),
        tap(() => {
          this.wasDelete.set(true);
          setTimeout(() => {
            this.wasDelete.set(false);
          }, 2000);
        }),
        tap(() => {
          this.studentsLoad();
        })
      )
      .subscribe();
  }
}
