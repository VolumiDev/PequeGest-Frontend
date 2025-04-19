import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { map } from 'rxjs';

@Component({
  selector: 'app-student-profile-data',
  imports: [ReactiveFormsModule],
  templateUrl: './studentProfileData.component.html',
})
export class StudentProfileDataComponent {
  fb = inject(FormBuilder);
  countryService = inject(CountryService);
  studentFormService = inject(StudentFormService);

  formUtils = FormUtils;

  countriesByRegion = signal<Country[]>([]);
  _classrooms = signal<ClassroomDto[]>([]);
  classrooms = computed<ClassroomDto[]>(() => this._classrooms());

  formHasError: boolean = false;
  maxDate: string = this.formUtils.customDateFormater();

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

  getClassrooms() {
    return this.studentFormService
      .getClassrooms()
      .pipe(map((classrooms) => this._classrooms.set(classrooms)))
      .subscribe();
  }

  updateStudentData() {
    throw new Error('Method not implemented.');
  }
}
