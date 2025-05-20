import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { AuthorizationPdfData } from '../../interfaces/AuthorizationPDFData.interface';
import { catchError, map, Observable, of, take } from 'rxjs';
import { Document } from '../../interfaces/Document.interface';
import { BaseResponse } from '../../interfaces/BaseResponse';

@Injectable({
  providedIn: 'root',
})
export class GenerateAuthService {
  private http = inject(HttpClient);

  private readonly BASE_URL = `${environment.baseUrl}/api/generate`;

  generateAuthorization(pdfData: AuthorizationPdfData): Observable<Document> {
    return this.http
      .post<BaseResponse>(`${this.BASE_URL}/authorization`, pdfData)
      .pipe(
        take(1),
        map((base) => base.content as Document),
        catchError((err) => {
          console.log('Ocurrio un error. ', err);
          return of();
        })
      );
  }
}
