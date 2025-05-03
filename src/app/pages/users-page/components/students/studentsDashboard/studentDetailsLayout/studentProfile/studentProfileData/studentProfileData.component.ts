import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { map, take, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { ClassroomDto } from '../../../../../../../../interfaces/ClassroomDto.inteface';
import { Country } from '../../../../../../interfaces/country.interface';
import { CountryService } from '../../../../../../../../services/country.services/country.service';
import { FormUtils } from '../../../../../../../../utils/FormUtils';
import { StudentDto } from './../../../../../../../../interfaces/StudentDto.interface';
import { StudentFormService } from '../../../../../../../../services/student.services/studentForm.service';
import { UserStudentTableService } from '../../../../../../../../services/student.services/usersStudentTable.service';
import { FormService } from '../../../../../../../../services/forms/form.service';

@Component({
  selector: 'app-student-profile-data',
  imports: [ReactiveFormsModule],
  templateUrl: './studentProfileData.component.html',
})
export class StudentProfileDataComponent {
  private studentFormService = inject(StudentFormService);
  private studenService = inject(UserStudentTableService);
  private formService = inject(FormService);
  private fb = inject(FormBuilder);

  countryService = inject(CountryService);

  private nextStep = signal<boolean>(false);
  countriesByRegion = signal<Country[]>([]);
  _classrooms = signal<ClassroomDto[]>([]);
  classrooms = computed<ClassroomDto[]>(() => this._classrooms());
  private studentSignal = signal<StudentDto | null>(null);

  private destroyRef = takeUntilDestroyed();

  formUtils = FormUtils;
  formHasError: boolean = false;
  maxDate: string = this.formUtils.customDateFormater();

  constructor() {
    this.studentSignal = this.studenService.getStudentByHash();

    this.getClassrooms();

    toObservable(this.nextStep).subscribe((bol) => {
      if (bol) {
        this.patchStudentForm(this.studentSignal());
        this.studentForm.markAsPristine;
      }
    });

    toObservable(this.studentSignal)
      .pipe(this.destroyRef)
      .subscribe((student) => {
        if (student) {
          const st = student as StudentDto;

          this.studentForm.patchValue(
            {
              name: st.name,
              lastname: st.lastname,
              region: st.region,
              country: st.country,
              birthdate: st.birthdate,
              alimentation: st.alimentation,
              classroom: st.classroomDto,
              comments: st.comments,
              doubleAuthorization: st.doubleAuthorization,
            },
            { emitEvent: false }
          );
        }
      });
  }

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

  getClassrooms() {
    return this.studentFormService
      .getClassrooms()
      .pipe(
        take(1),
        map((classrooms) => this._classrooms.set(classrooms))
      )
      .subscribe({
        complete: () => {
          this.nextStep.set(true);
        },
      });
  }

  patchStudentForm(st: StudentDto | null) {
    if (!st) return;
    this.studentForm.patchValue(
      {
        name: st.name,
        lastname: st.lastname,
        region: st.region,
        country: st.country,
        birthdate: st.birthdate,
        alimentation: st.alimentation,
        classroom: st.classroomDto,
        comments: st.comments,
        doubleAuthorization: st.doubleAuthorization,
      },
      { emitEvent: false }
    );
  }

  compareClassrooms = (c1?: ClassroomDto, c2?: ClassroomDto): boolean => {
    // Si ambos existen, compara por hash (o cualquier ID único)
    if (c1 && c2) {
      return c1.hash === c2.hash;
    }
    // Si ambos son null/undefined, considéralos iguales
    return c1 === c2;
  };

  updateStudentData() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched;
      return;
    }

    if (this.studentForm.pristine) {
      console.log('No se modifico el alumno, no se envia nada');
      this.formService.isPristine.set(true);
      setTimeout(() => {
        this.formService.isPristine.set(false);
      }, 2000);
      return;
    }

    const updatedStudent = this.studentSignal();
    if (updatedStudent) {
      updatedStudent.name = this.studentForm.controls['name'].value;
      updatedStudent.lastname = this.studentForm.controls['lastname'].value;
      updatedStudent.birthdate = this.studentForm.controls['birthdate'].value;
      updatedStudent.alimentation =
        this.studentForm.controls['alimentation'].value;
      updatedStudent.classroomDto =
        this.studentForm.controls['classroom'].value;
      updatedStudent.comments = this.studentForm.controls['comments'].value;
      updatedStudent.doubleAuthorization =
        this.studentForm.controls['doubleAuthorization'].value;
    }

    // console.log(updatedStudent);

    if (null != updatedStudent) {
      this.studenService
        .updateStudent(updatedStudent)
        .pipe(
          take(1),
          tap((t) => console.log(console.log()))
        )
        .subscribe();

      this.formService.wasAccept.set(true);
      setTimeout(() => {
        this.formService.wasAccept.set(false);
      }, 2000);
    }
  }

  isDifferent(original: StudentDto, newStudent: StudentDto): boolean {
    debugger;
    if (
      original.name !== newStudent.name ||
      original.lastname !== newStudent.lastname ||
      original.birthdate !== newStudent.birthdate ||
      original.alimentation !== newStudent.alimentation ||
      original.classroomDto.hash !== newStudent.classroomDto.hash ||
      original.comments !== newStudent.comments ||
      original.doubleAuthorization !== newStudent.doubleAuthorization
    ) {
      return true;
    } else {
      return false;
    }
  }
}
