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

@Component({
  selector: 'app-student-detail-form',
  imports: [ParentFormComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './studentDetailForm.component.html',
})
export class StudentDetailFormComponent implements OnInit {
  ngOnInit(): void { }

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


  parentForm: FormGroup = this.fb.group({
    parentName: ['', [Validators.required]],
    paremtLastname: ['', [Validators.required]],
    parentRegion: ['', [Validators.required]],
    parentCountry: ['', [Validators.required]],
    parentId: ['', [Validators.required]],
    parentTelephone: ['', [Validators.required]],
    parentEmail: ['', [Validators.required]],
  });

  studentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: ['', Validators.required],
    country: ['', Validators.required],
    birthdate: ['', [Validators.required]],
    alimentation: ['', [Validators.required]],
    classroom: ['', [Validators.required]],
    parentForm: this.parentForm,
    comments: [''],
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

  parentOnFormChanged = effect((onCleanUp) => {
    const regionSubcription = this.countryService.onRegionChange(
      this.parentForm,
      this.parentCountriesByRegion
    );

    onCleanUp(() => {
      regionSubcription.unsubscribe();
    });
  });

  onSubmitStudent() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }
    console.log(this.studentForm.value);
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

  addParent() {
    if (this.parentForm.invalid) {
      this.parentForm.markAllAsTouched();
      return;
    }
    console.log(this.parentForm.value);
    this.resetForm();
  }
}
