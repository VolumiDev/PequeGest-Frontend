import { Component } from '@angular/core';
import { StudentsTableComponent } from "../students-table/students-table.component";
import { StudentDetailFormComponent } from "../studentDetailForm/studentDetailForm.component";

@Component({
  selector: 'app-students-data-details',
  imports: [StudentsTableComponent, StudentDetailFormComponent],
  templateUrl: './studentsDataDetails.component.html',
})
export class StudentsDataDetailsComponent { }
