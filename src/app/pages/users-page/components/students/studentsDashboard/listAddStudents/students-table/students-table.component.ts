import { Component, inject, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { UploadFileComponent } from '../../../../../shared/components/side-menu/uploadFile/uploadFile.component';
import { DocumentsService } from '../../../../../services/documents/documents.service';

@Component({
  selector: 'app-students-table',
  imports: [UploadFileComponent],
  templateUrl: './students-table.component.html',
})
export class StudentsTableComponent implements OnInit {
  studentService = inject(UserStudentTableService);
  documentService = inject(DocumentsService);

  private _studentSelected = signal<StudentDto | null>(null);
  studentSelected = computed(() => this._studentSelected());

  studentSelection(student: StudentDto) {
    this.documentService.studentSelected.set(student);
  }

  studentsLoad() {
    this.studentService
      .getAllStudents()
      .pipe(
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
}
