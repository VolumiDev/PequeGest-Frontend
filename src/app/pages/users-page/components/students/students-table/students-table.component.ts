import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { StudentService } from '../../../../../services/StudentService.service';
import { Student } from '../../../../../interfaces/Student.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-students-table',
  imports: [],
  templateUrl: './students-table.component.html',
})
export class StudentsTableComponent implements OnInit{
  
  private studentService = inject(StudentService);
  
  private _students = signal<Student[]>([]);
  students = computed<Student[]>(() =>this._students());
  
  studentsLoad(){
    this.studentService.getAllStudents().pipe(
      tap( (students) => {
        console.log(students)
        this._students.set(students);
      })
    ).subscribe()
  }



  ngOnInit(): void {
    this.studentsLoad();
  } 
}
