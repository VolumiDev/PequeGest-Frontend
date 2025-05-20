import { Component, computed, inject, Input, signal } from '@angular/core';
import { StudentDto } from '../../../../interfaces/StudentDto.interface';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environment/enviroment';
import { AuthorizationPdfData } from '../../../../interfaces/AuthorizationPDFData.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/FormUtils';
import { GenerateAuthService } from '../../../../services/documents/generateAuth.service';
import { catchError, of, take, tap } from 'rxjs';

@Component({
  selector: 'app-user-uistudent-card',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './userUIStudentCard.component.html',
})
export class UserUIStudentCardComponent {
  @Input() student?: StudentDto;
  generateService = inject(GenerateAuthService);
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  readonly BASE_URL = `${environment.baseUrl}`;

  authForm = this.fb.group({
    beneficiary: ['', [Validators.required]],
    docidBeneficiary: ['', [Validators.required, FormUtils.dniNieValidator()]],
  });

  generateAthorization() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const pdfData: AuthorizationPdfData = {
      studentHash: this.student?.hash!,
      beneficiary: this.authForm.controls['beneficiary'].value!,
      docidBeneficiary: this.authForm.controls['docidBeneficiary'].value!,
    };
    console.log(pdfData);

    this.generateService
      .generateAuthorization(pdfData)
      .pipe(
        take(1),
        tap((doc) => {
          window.open(`${this.BASE_URL}${doc?.path}`);
        }),
        catchError((err) => {
          console.log('Ocurrio un error. ', err);
          return of();
        })
      )
      .subscribe();
  }
}
