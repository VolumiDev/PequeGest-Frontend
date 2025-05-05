import {
  Component,
  effect,
  ElementRef,
  inject,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../../../../../../../utils/FormUtils';
import { ParentDto } from '../../../../../../../../../interfaces/ParentDto.interface';
import { UserService } from '../../../../../../../../../services/users/user.service';
import { take } from 'rxjs';
import { FormService } from '../../../../../../../../../services/forms/form.service';
import { UploadFileComponent } from '../../../../../../../../../shared/components/side-menu/uploadFile/uploadFile.component';
import { UserUploadImageComponent } from './userUploadImage/userUploadImage.component';

@Component({
  selector: 'app-parent-card-form',
  imports: [ReactiveFormsModule, UserUploadImageComponent],
  templateUrl: './parentCardForm.component.html',
})
export class ParentCardFormComponent {
  @ViewChild(UserUploadImageComponent)
  userUploadImageComp!: UserUploadImageComponent;

  openModal() {
    this.userUploadImageComp.openModal();
  }

  private fb = inject(FormBuilder);
  private userSerevice = inject(UserService);
  private formService = inject(FormService);

  formUtils = FormUtils;

  parentSignal = signal<ParentDto | null>(null);

  @Input()
  set parent(value: ParentDto | null) {
    this.parentSignal.set(value);
  }

  constructor() {
    effect(() => {
      const parent = this.parentSignal();
      if (parent) {
        this.parentForm.patchValue(parent);
      }
    });
  }

  parentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    region: [null, [Validators.required]],
    country: [null, [Validators.required]],
    docid: ['', [Validators.required]],
    telephone: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
  });

  updateParent() {
    if (this.parentForm.invalid) {
      this.parentForm.markAllAsTouched();
      return;
    }
    if (this.parentForm.pristine) {
      console.log('No se modififco el padre, no se envia nada');
      this.formService.isPristine.set(true);
      setTimeout(() => {
        this.formService.isPristine.set(false);
      }, 2000);
      return;
    }

    const updatedParent = this.parentSignal();
    if (updatedParent) {
      updatedParent.name = this.parentForm.controls['name'].value;
      updatedParent.lastname = this.parentForm.controls['lastname'].value;
      updatedParent.docid = this.parentForm.controls['docid'].value;
      updatedParent.telephone = this.parentForm.controls['telephone'].value;
      updatedParent.email = this.parentForm.controls['email'].value;
    }

    if (null !== updatedParent) {
      console.log(updatedParent);

      this.userSerevice
        .updateParentData(updatedParent!)
        .pipe(take(1))
        .subscribe();
    }

    this.formService.wasAccept.set(true);
    setTimeout(() => {
      this.formService.wasAccept.set(false);
    }, 2000);
  }
}
