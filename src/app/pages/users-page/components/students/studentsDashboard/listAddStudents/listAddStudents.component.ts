import { Component } from '@angular/core';
import { StudentDetailFormComponent } from './studentDetailForm/studentDetailForm.component';
import { StudentsTableComponent } from './students-table/students-table.component';

@Component({
  selector: 'app-list-add-students',
  imports: [
    StudentDetailFormComponent,
    StudentsTableComponent,
  ],
  templateUrl: './listAddStudents.component.html',
})
export class ListAddStudentsComponent { }
