import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ParentFormComponent } from '../parentForm/parentForm.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../../../utils/FormUtils';
import { JsonPipe } from '@angular/common';
import { CountryService } from '../../../../../services/country.services/country.service';
import { Country } from '../../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';
import { Classroom } from '../../../../../interfaces/Classroom.inteface';
import { StudentFormService } from '../../../../../services/student.services/studentForm.service';
import { ClassroomFormInput } from '../../../interfaces/classroomFormInput.interface';
import { Parent } from '../../../../../interfaces/Parent.interface';
import { Student } from '../../../../../interfaces/Student.interface';

@Component({
  selector: 'app-student-detail-form',
  imports: [ReactiveFormsModule, JsonPipe, ParentFormComponent],
  templateUrl: './studentDetailForm.component.html',
})
export class StudentDetailFormComponent implements OnInit {
  ngOnInit(): void {}

  fb = inject(FormBuilder);
  countryService = inject(CountryService);
  studentFormService = inject(StudentFormService);

  formUtils = FormUtils;

  countriesByRegion = signal<Country[]>([]);
  parentCountriesByRegion = signal<Country[]>([]);

  _classrooms = signal<ClassroomFormInput[]>([]);
  classrooms = computed<ClassroomFormInput[]>(() => this._classrooms());

  maxDate: string = this.formUtils.customDateFormater();
  isVisibleParentForm: boolean = false;
  parents: Parent[] = [];

  studentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: ['', Validators.required],
    country: ['', Validators.required],
    birthdate: ['', [Validators.required]],
    alimentation: ['', [Validators.required]],
    classroom: ['', [Validators.required]],
    comments: [''],
    // parents: this.fb.array([], FormUtils.minArrayLengthValidator(1)),
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
    const student: Student = {
      name: this.studentForm.controls['name'].value,
      lastname: this.studentForm.controls['lastname'].value,
      country: this.studentForm.controls['country'].value,
      classroom: this.studentForm.controls['classroom'].value,
      birthdate: this.studentForm.controls['birthdate'].value,
      alimentation: this.studentForm.controls['alimentation'].value,
      comments: this.studentForm.controls['comments'].value,
      parents: this.studentFormService._parents(),
    };

    if (student.parents.length === 0) {
      console.log(this.studentForm.value);
    }
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
    });
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
    return this.studentFormService.getClassrooms().subscribe((classrooms) =>
      this._classrooms.set(
        classrooms.map<ClassroomFormInput>((classroom) => ({
          id: classroom.id,
          name: classroom.classroomName,
        }))
      )
    );
  }

  removeParentFromForm(value: string) {
    this.studentFormService._parents.update((currentParents) =>
      currentParents.filter((parent) => parent.docid != value)
    );
  }
}
