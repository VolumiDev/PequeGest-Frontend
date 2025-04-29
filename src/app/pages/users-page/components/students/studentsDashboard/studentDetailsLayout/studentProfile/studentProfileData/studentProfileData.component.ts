import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { FormUtils } from '../../../../../../../../utils/FormUtils';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../../../../../../../services/country.services/country.service';
import { Country } from '../../../../../../interfaces/country.interface';
import { ClassroomDto } from '../../../../../../../../interfaces/ClassroomDto.inteface';
import { StudentFormService } from '../../../../../../../../services/student.services/studentForm.service';
import { map, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserStudentTableService } from '../../../../../../../../services/student.services/usersStudentTable.service';
import { StudentDto } from '../../../../../../../../interfaces/StudentDto.interface';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-profile-data',
  imports: [ReactiveFormsModule],
  templateUrl: './studentProfileData.component.html',
})
export class StudentProfileDataComponent {
  private studentFormService = inject(StudentFormService);
  private studenService = inject(UserStudentTableService);
  private fb = inject(FormBuilder);
  private destroyRef = takeUntilDestroyed();

  countryService = inject(CountryService);
  formUtils = FormUtils;

  constructor() {
    const studentSignal = this.studenService.getStudentByHash();

    toObservable(studentSignal)
      .pipe(this.destroyRef)
      .subscribe((student) => {
        if (student) {
          this.studentForm.patchValue(student);
        }
      });
  }

  countriesByRegion = signal<Country[]>([]);
  _classrooms = signal<ClassroomDto[]>([]);
  classrooms = computed<ClassroomDto[]>(() => this._classrooms());

  formHasError: boolean = false;
  maxDate: string = this.formUtils.customDateFormater();

  studentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: ['', Validators.required],
    country: ['', Validators.required],
    birthdate: ['', [Validators.required, FormUtils.birthdateValidator]],
    alimentation: ['', [Validators.required]],
    classroom: ['', [Validators.required]],
    comments: ['', [Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    doubleAuthorization: [''],
  });

  onFormChanged = effect((onCleanUp) => {
    const regionSubcription = this.countryService.onRegionChange(
      this.studentForm,
      this.countriesByRegion
    );
    const classroomSubscription = this.getClassrooms();

    onCleanUp(() => {
      regionSubcription.unsubscribe();
      classroomSubscription.unsubscribe();
    });
  });

  getClassrooms() {
    return this.studentFormService
      .getClassrooms()
      .pipe(map((classrooms) => this._classrooms.set(classrooms)))
      .subscribe();
  }

  updateStudentData() {
    throw new Error('Method not implemented.');
  }

  // getStudentData(hash: string) {
  //   this.userStudentTableService
  //     .getStudentByHash(hash)
  //     .pipe(
  //       take(1),
  //       tap((student) => this.student.set(student)),
  //       tap((std) => this.studentForm.patchValue(this.student()!))
  //     )
  //     .subscribe();

  //   console.log(this.student());
  // }
}
