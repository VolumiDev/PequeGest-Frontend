import { computed, inject, Injectable, signal } from '@angular/core';
import { StudentDto } from '../interfaces/StudentDto.interface';
import { environment } from '../../environment/enviroment';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../interfaces/BaseResponse';

@Injectable({
  providedIn: 'root',
})
export class UserUIStudentServiceService {
  private http = inject(HttpClient);

  private readonly BASE_URL = `${environment.baseUrl}/api/student/byParent`;

  _student = signal<StudentDto[]>([]);
  student = computed(() => this._student());

  getStudentsByParentHash(hash: string): Observable<StudentDto[]> {
    return this.http.get<BaseResponse>(`${this.BASE_URL}/${hash}`).pipe(
      take(1),
      map((base) => base.content as StudentDto[]),
      tap((students) => console.log('service', students)),
      catchError((err) => {
        console.log(`Ocurrio un error ${err}`);
        return of([]);
      })
    );
  }
}
