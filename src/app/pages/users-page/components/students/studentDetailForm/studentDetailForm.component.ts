import { Component, effect, inject, signal } from '@angular/core';
import { ParentFormComponent } from '../parentForm/parentForm.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../../../utils/FormUtils';
import { JsonPipe } from '@angular/common';
import { StudentFormServiceService } from '../../../services/studentFormService.service';
import { Country } from '../../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-student-detail-form',
  imports: [ParentFormComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './studentDetailForm.component.html',
})
export class StudentDetailFormComponent {
  fb = inject(FormBuilder);
  studentFormServices = inject(StudentFormServiceService);
  formUtils = FormUtils;

  maxDate: string = this.todayFormater();
  isVisibleParentForm: boolean = false;
  countriesByRegion = signal<Country[]>([]);

  studentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: ['', Validators.required],
    country: ['', Validators.required],
    birthdate: ['', [Validators.required]],
    alimentation: ['', [Validators.required]],
    classroom: ['', [Validators.required]],
    comments: [''],
  });

  onFormChanged = effect((onCleanUp) => {
    const regionSubcription = this.onRegionChange();
    console.log('Estamos en el cambio');

    onCleanUp(() => {
      regionSubcription.unsubscribe();
    });
  });

  onRegionChange() {
    return this.studentForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.studentForm.get('country')?.setValue('')),
        tap(() => {
          this.countriesByRegion.set([]);
        }),
        switchMap((region) =>
          this.studentFormServices.getCountriesByRegion(region ?? '')
        )
      )
      .subscribe((countries) => {
        this.countriesByRegion.set(countries);
      });
  }

  onSubmitStudent() {
    console.log(this.maxDate);
    
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }
    console.log(this.studentForm.value);
    this.studentForm.reset({
      name: '',
      lastname: '',
      country: '',
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

  todayFormater(): string{
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`
  }
}
