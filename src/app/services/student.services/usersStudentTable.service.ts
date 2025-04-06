import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDto } from '../../interfaces/StudentDto.interface';
import { environment } from '../../../environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserStudentTableService {
  private readonly BASE_URL = `${environment.baseUrl}/api/student`;
  private http = inject(HttpClient);

  _students = signal<StudentDto[]>([]);
  students = computed<StudentDto[]>(() => this._students());

  getAllStudents(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(`${this.BASE_URL}/all`);
  }

  saveStudent(student: StudentDto): Observable<StudentDto> {
    return this.http.post<StudentDto>(`${this.BASE_URL}`, student);
  }
}
