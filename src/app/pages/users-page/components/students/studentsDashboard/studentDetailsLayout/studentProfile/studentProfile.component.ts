import { Component, inject, OnInit, signal } from '@angular/core';
import { StudentDetailFormComponent } from '../../listAddStudents/studentDetailForm/studentDetailForm.component';
import { FormUtils } from '../../../../../../../utils/FormUtils';
import { StudentProfileDataComponent } from './studentProfileData/studentProfileData.component';
import { ParentCardComponent } from './parentCard/parentCard.component';
import { ActivatedRoute } from '@angular/router';
import { UserStudentTableService } from '../../../../../../../services/student.services/usersStudentTable.service';
import { map, switchMap, take, tap } from 'rxjs';
import { StudentDto } from '../../../../../../../interfaces/StudentDto.interface';
import { UserService } from '../../../../../../../services/users/user.service';
import { FormService } from '../../../../../../../services/forms/form.service';

@Component({
  selector: 'app-student-profile',
  imports: [StudentProfileDataComponent, ParentCardComponent],
  templateUrl: './studentProfile.component.html',
})
export class StudentProfileComponent implements OnInit {
  ngOnInit(): void {
    const studentHash =
      this.activatedRoute.snapshot.paramMap.get('studentHash');

    this.getStudentData(studentHash!);
  }

  private activatedRoute = inject(ActivatedRoute);
  userStudentTableService = inject(UserStudentTableService);
  userService = inject(UserService);
  formService = inject(FormService);

  // studentSignal = signal<StudentDto | null>(null);
  studentSignal = this.userStudentTableService.getStudentByHash();

  getStudentData(hash: string) {
    this.userStudentTableService
      .fetchStudentByHash(hash)
      .pipe(
        take(1),
        map((base) => this.studentSignal.set(base.content as StudentDto))
      )
      .subscribe();
  }
}
