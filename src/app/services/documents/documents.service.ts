import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/Auth.service';
import { environment } from '../../../environment/enviroment';
import { StudentDto } from '../../interfaces/StudentDto.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private readonly BASE_URL = `${environment.baseUrl}/api/document`;

  http = inject(HttpClient);
  authService = inject(AuthService);

  studentSelected = signal<StudentDto | null>(null);
  imageTimestamp = signal<number | null>(null);

  // uploadDocuments(documents?: FileList): Observable<string[]> {
  //   if (!documents) return of([]);

  //   const uploadObservables = Array.from(documents).map((documentFile) =>
  //     this.uploadDocument(documentFile)
  //   );
  // }

  uploadImageProfile(formaDataImageProfile?: FormData): Observable<string> {
    return this.http.post<string>(
      `${this.BASE_URL}/imageProfile`,
      formaDataImageProfile
    );
  }
}
