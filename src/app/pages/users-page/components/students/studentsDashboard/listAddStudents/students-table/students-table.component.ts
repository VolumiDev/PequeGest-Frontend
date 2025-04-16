import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { tap } from 'rxjs';
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
