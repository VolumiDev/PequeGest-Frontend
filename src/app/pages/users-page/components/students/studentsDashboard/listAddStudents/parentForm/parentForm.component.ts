import { Component, effect, inject, Input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StudentFormService } from '../../../../../../../services/student.services/studentForm.service';
import { CountryService } from '../../../../../../../services/country.services/country.service';
import { Country } from '../../../../../interfaces/country.interface';
import { FormUtils } from '../../../../../../../utils/FormUtils';

@Component({
  selector: 'app-parent-form',
  imports: [ReactiveFormsModule],
  templateUrl: './parentForm.component.html',
})
export class ParentFormComponent {
  private fb = inject(FormBuilder);

  studentFormService = inject(StudentFormService);

  countryService = inject(CountryService);
  countriesByRegion = signal<Country[]>([]);

  formUtils = FormUtils;

  parentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: [null, [Validators.required]],
    country: [null, [Validators.required]],
    docid: ['', [Validators.required, FormUtils.dniNieValidator]],
    telephone: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
  });

  parentOnFormChanged = effect((onCleanUp) => {
    const regionSubcription = this.countryService.onRegionChange(
      this.parentForm,
      this.countriesByRegion
    );

    onCleanUp(() => {
      regionSubcription.unsubscribe();
    });
  });

  addParent() {
    if (this.parentForm.invalid) {
      this.parentForm.markAllAsTouched();
      return;
    }

    const parent = this.parentForm.value;

    this.studentFormService._parents.update((curretnParents) => [
      ...curretnParents,
      parent,
    ]);
    this.resetForm();
  }

  resetForm() {
    this.parentForm.reset({
      name: '',
      lastname: '',
      region: '',
      country: '',
      id: '',
      telephone: '',
      email: '',
    });
  }
}
