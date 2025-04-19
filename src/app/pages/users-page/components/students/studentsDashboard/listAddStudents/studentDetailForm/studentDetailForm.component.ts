import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../../../../../../services/country.services/country.service';
import { StudentFormService } from '../../../../../../../services/student.services/studentForm.service';
import { UserStudentTableService } from '../../../../../../../services/student.services/usersStudentTable.service';
import { FormUtils } from '../../../../../../../utils/FormUtils';
import { Country } from '../../../../../interfaces/country.interface';
import { ClassroomDto } from '../../../../../../../interfaces/ClassroomDto.inteface';
import { ParentDto } from '../../../../../../../interfaces/ParentDto.interface';
import { StudentDto } from '../../../../../../../interfaces/StudentDto.interface';
import { catchError, map, of, take } from 'rxjs';
import { ParentFormComponent } from '../parentForm/parentForm.component';

@Component({
  selector: 'app-student-detail-form',
  imports: [ReactiveFormsModule, ParentFormComponent],
  templateUrl: './studentDetailForm.component.html',
})
export class StudentDetailFormComponent implements OnInit {
  ngOnInit(): void {}

  fb = inject(FormBuilder);
  countryService = inject(CountryService);
  studentFormService = inject(StudentFormService);
  usersStudentTableService = inject(UserStudentTableService);

  formUtils = FormUtils;

  countriesByRegion = signal<Country[]>([]);
  parentCountriesByRegion = signal<Country[]>([]);

  _classrooms = signal<ClassroomDto[]>([]);
  classrooms = computed<ClassroomDto[]>(() => this._classrooms());

  formHasError: boolean = false;
  maxDate: string = this.formUtils.customDateFormater();
  isVisibleParentForm: boolean = false;
  parents: ParentDto[] = [];

  studentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: [null, Validators.required],
    country: [null, Validators.required],
    birthdate: ['', [Validators.required, FormUtils.birthdateValidator]],
    alimentation: [null, [Validators.required]],
    classroom: [null, [Validators.required]],
    comments: ['', [Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    doubleAuthorization: [false],
    isFormParentActive: [false],
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

  onSubmitStudent() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    if (this.studentFormService._parents().length < 1) {
      this.formHasError = true;
      setTimeout(() => {
        this.formHasError = false;
      }, 1500);
      return;
    }

    const student: StudentDto = {
      name: this.studentForm.controls['name'].value,
      lastname: this.studentForm.controls['lastname'].value,
      country: this.studentForm.controls['country'].value,
      classroomDto: this.studentForm.controls['classroom'].value,
      birthdate: this.studentForm.controls['birthdate'].value,
      alimentation: this.studentForm.controls['alimentation'].value,
      comments: this.studentForm.controls['comments'].value,
      doubleAuthorization:
        this.studentForm.controls['doubleAuthorization'].value,
      parentsDto: this.studentFormService._parents(),
    };

    this.usersStudentTableService._students.update((currentStudent) => [
      ...currentStudent,
      student,
    ]);

    this.usersStudentTableService
      .saveStudent(student)
      .pipe(
        take(1),
        catchError((error) => {
          console.log(`Ocurrio un error: ${error}`);
          return of([]);
        })
      )
      .subscribe();

    this.resetForm();
  }

  resetForm() {
    this.studentForm.reset({
      name: '',
      lastname: '',
      country: '',
      region: '',
      birthdate: '',
      alimentation: '',
      classroom: '',
      comments: '',
      isFormParentActive: false,
    });
    this.studentFormService._parents.set([]);
  }

  changeParentFormVisibility(event: Event) {
    event?.preventDefault();
    if (this.isVisibleParentForm) {
      this.isVisibleParentForm = false;
    } else {
      this.isVisibleParentForm = true;
    }
    console.log(this.isVisibleParentForm);
  }

  getClassrooms() {
    return this.studentFormService
      .getClassrooms()
      .pipe(map((classrooms) => this._classrooms.set(classrooms)))
      .subscribe();
  }

  removeParentFromForm(value: string) {
    this.studentFormService._parents.update((currentParents) =>
      currentParents.filter((parent) => parent.docid != value)
    );
  }
}
