import { Component, effect, inject, signal } from '@angular/core';
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
  fb = inject(FormBuilder);

  studentFormService = inject(StudentFormService);

  countryService = inject(CountryService);
  countriesByRegion = signal<Country[]>([]);

  formUtils = FormUtils;

  parentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    lastname: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    docid: ['', [Validators.required]],
    telephone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
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
