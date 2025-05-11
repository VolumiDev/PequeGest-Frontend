import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { AuthService } from '../../auth/services/Auth.service';
import { environment } from '../../../environment/enviroment';
import { StudentDto } from '../../interfaces/StudentDto.interface';
import { BaseResponse } from '../../interfaces/BaseResponse';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private readonly BASE_URL = `${environment.baseUrl}/api/document`;

  http = inject(HttpClient);
  authService = inject(AuthService);

  studentSelected = signal<StudentDto | null>(null);
  imageTimestamp = signal<number | null>(null);

  uploadStudentImageProfile(
    formaDataImageProfile?: FormData
  ): Observable<string> {
    return this.http.post<string>(
      `${this.BASE_URL}/student/imageProfile`,
      formaDataImageProfile
    );
  }

  uploadUserImageProfile(
    formaDataImageProfile?: FormData
  ): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      `${this.BASE_URL}/user/imageProfile`,
      formaDataImageProfile
    );
  }

  getCardIdByUserHash(
    userHash: string
  ): Observable<BaseResponse | Blob | null> {
    return this.http
      .get(`${this.BASE_URL}/cardid/${userHash}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        switchMap((response) => {
          const contentType = response.headers.get('Content-Type') || '';

          if (contentType.includes('application/json')) {
            // Convertir Blob a texto y luego a JSON
            return from(response.body!.text()).pipe(
              map((text) => JSON.parse(text) as BaseResponse)
            );
          }

          return of(response.body); // Es una imagen (Blob)
        })
      );
  }

  getDocsByStudentHash(hash: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${this.BASE_URL}/student/${hash}`);
  }

  uploadDocs(hash: string, type: string, files: File[]) {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    return this.http.post(`${this.BASE_URL}/upload/${hash}`, formData, {
      headers: {
        userType: type,
      },
    });
  }

  downloadDocByHash(hash: string): Observable<Blob> {
    return this.http.get(`${this.BASE_URL}/download/${hash}`, {
      responseType: 'blob',
    });
  }
}
