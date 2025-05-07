import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { catchError, of, take, tap } from 'rxjs';
import { UploadFileComponent } from '../../../../../../../shared/components/side-menu/uploadFile/uploadFile.component';
import { UserStudentTableService } from '../../../../../../../services/student.services/usersStudentTable.service';
import { DocumentsService } from '../../../../../../../services/documents/documents.service';
import { StudentDto } from '../../../../../../../interfaces/StudentDto.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-students-table',
  imports: [UploadFileComponent, RouterLink],
  templateUrl: './students-table.component.html',
})
export class StudentsTableComponent implements OnInit {
  studentService = inject(UserStudentTableService);
  documentService = inject(DocumentsService);

  wasDelete = signal<boolean>(false);
  hasError = signal<boolean>(false);
  private _studentSelected = signal<StudentDto | null>(null);
  studentSelected = computed(() => this._studentSelected());

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
