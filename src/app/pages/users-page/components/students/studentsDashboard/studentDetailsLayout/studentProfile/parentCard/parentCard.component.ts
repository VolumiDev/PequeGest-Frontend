import { Component, inject, Input, ViewChild } from '@angular/core';
import { ParentFormComponent } from '../../../listAddStudents/parentForm/parentForm.component';
import { ParentDto } from '../../../../../../../../interfaces/ParentDto.interface';
import { ParentCardFormComponent } from './parentCardForm/parentCardForm.component';
import { CardIdModalComponent } from './cardIdModal/cardIdModal.component';
import { UserUploadImageComponent } from './parentCardForm/userUploadImage/userUploadImage.component';
import { DocumentsService } from '../../../../../../../../services/documents/documents.service';
import { catchError, of, take, tap } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../../../../environment/enviroment';

@Component({
  selector: 'app-parent-card',
  imports: [ParentCardFormComponent, CardIdModalComponent],
  templateUrl: './parentCard.component.html',
})
export class ParentCardComponent {
  @Input() parent: ParentDto | null = null;

  @ViewChild(CardIdModalComponent)
  idCardModal!: CardIdModalComponent;

  documentService = inject(DocumentsService);
  sanitizer = inject(DomSanitizer);

  BASE_URL = environment.baseUrl;
  imageUrl: SafeUrl | null = null;
  errorMessage: string | null = null;

  openModal() {
    console.log(this.parent);
    // this.getIdCard();
    this.idCardModal.openModal();
  }

  // getIdCard() {
  //   this.documentService
  //     .getCardIdByUserHash(this.parent!.hash!)
  //     .pipe(
  //       take(1),
  //       tap((res) => {
  //         if (res instanceof Blob) {
  //           const url = URL.createObjectURL(res);
  //           this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  //           this.errorMessage = null;
  //         } else {
  //           this.imageUrl = null;
  //         }
  //       }),
  //       catchError((err) => {
  //         console.error('Error en la petición:', err);
  //         this.errorMessage = 'Error de red o servidor.';
  //         this.imageUrl = null;
  //         return of(null);
  //       })
  //     )
  //     .subscribe();
  // }
}
