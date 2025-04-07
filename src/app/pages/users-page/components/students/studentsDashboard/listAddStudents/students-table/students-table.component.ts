import { Component, inject, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { UserStudentTableService } from '../../../../../../../services/student.services/usersStudentTable.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students-table',
  imports: [
    RouterLink
  ],
  templateUrl: './students-table.component.html',
})
export class StudentsTableComponent implements OnInit {
  studentService = inject(UserStudentTableService);

  // private _students = signal<Student[]>([]);
  // students = computed<Student[]>(() => this._students());

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
