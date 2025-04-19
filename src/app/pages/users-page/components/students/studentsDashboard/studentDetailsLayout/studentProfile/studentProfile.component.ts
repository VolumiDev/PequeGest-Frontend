import { Component, inject } from '@angular/core';
import { StudentDetailFormComponent } from '../../listAddStudents/studentDetailForm/studentDetailForm.component';
import { FormUtils } from '../../../../../../../utils/FormUtils';
import { StudentProfileDataComponent } from './studentProfileData/studentProfileData.component';

@Component({
  selector: 'app-student-profile',
  imports: [StudentProfileDataComponent],
  templateUrl: './studentProfile.component.html',
})
export class StudentProfileComponent {}
