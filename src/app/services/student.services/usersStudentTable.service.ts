import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Observable } from 'rxjs';

import { BaseResponse } from '../../interfaces/BaseResponse';
import { environment } from '../../../environment/enviroment';
import { StudentDto } from './../../interfaces/StudentDto.interface';

@Injectable({
  providedIn: 'root',
})
export class UserStudentTableService {
  private readonly BASE_URL = `${environment.baseUrl}/api/student`;
  private http = inject(HttpClient);

  _students = signal<StudentDto[]>([]);
  students = computed<StudentDto[]>(() => this._students());

  private studentByHash = signal<StudentDto | null>(null);

  getStudentByHash() {
    return this.studentByHash;
  }

  getAllStudents(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(`${this.BASE_URL}/all`);
  }

  fetchStudentByHash(hash: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${this.BASE_URL}/${hash}`);
  }

  saveStudent(student: StudentDto): Observable<StudentDto> {
    return this.http.post<StudentDto>(`${this.BASE_URL}`, student);
  }

  updateStudent(student: StudentDto): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(
      `${this.BASE_URL}/update/${student.hash!}`,
      student
    );
  }

  deleteByHash(hash: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.BASE_URL}/delete/${hash}`);
  }
}
