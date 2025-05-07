import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DocumentsService } from '../../../../../../../../../services/documents/documents.service';
import { ParentDto } from '../../../../../../../../../interfaces/ParentDto.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, of, take, tap } from 'rxjs';

@Component({
  selector: 'app-card-id-modal',
  imports: [],
  templateUrl: './cardIdModal.component.html',
})
export class CardIdModalComponent {
  @ViewChild('cardIdModal')
  cardIdModal!: ElementRef<HTMLDialogElement>;

  @Input() imageUrl: SafeUrl | null = null;
  @Input() errorMessage: string | null = null;

  openModal() {
    this.cardIdModal.nativeElement.showModal();
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
