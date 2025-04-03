import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Classroom } from './../../interfaces/Classroom.inteface';
import { environment } from '../../../environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class StudentFormService {
  private readonly BASE_URL = `${environment.baseUrl}/api/classroom`;

  private http = inject(HttpClient);

  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.BASE_URL}`);
  }
}
