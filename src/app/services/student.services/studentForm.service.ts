import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ClassroomDto } from '../../interfaces/ClassroomDto.inteface';
import { environment } from '../../../environment/enviroment';
import { StudentDto } from '../../interfaces/StudentDto.interface';
import { ParentDto } from '../../interfaces/ParentDto.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentFormService {
  private readonly BASE_URL = `${environment.baseUrl}/api/classroom`;

  private http = inject(HttpClient);
  _parents = signal<ParentDto[]>([]);
  _student = signal<StudentDto | null>(null);

  getClassrooms(): Observable<ClassroomDto[]> {
    return this.http.get<ClassroomDto[]>(`${this.BASE_URL}`);
  }
}
