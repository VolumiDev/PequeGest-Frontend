import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserStudentTableService } from '../../../../../services/student.services/usersStudentTable.service';
import { StudentDto } from '../../../../../interfaces/StudentDto.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-students-table',
  imports: [],
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
