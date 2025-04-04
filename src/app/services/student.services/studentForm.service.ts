import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Classroom } from './../../interfaces/Classroom.inteface';
import { environment } from '../../../environment/enviroment';
import { Student } from '../../interfaces/Student.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentFormService {
  private readonly BASE_URL = `${environment.baseUrl}/api/classroom`;

  private http = inject(HttpClient);

  private _student = signal<Student | null>(null);

  student = computed<Student | null>(() => this._student());

  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.BASE_URL}`);
  }
}
