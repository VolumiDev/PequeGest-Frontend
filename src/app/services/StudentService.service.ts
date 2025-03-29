import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../interfaces/Student.interface';
import { environment } from '../../environment/enviroment';



@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly BASE_URL = `${environment.baseUrl}/api/student`
  private http = inject(HttpClient);


  getAllStudents(): Observable<Student[]> {
     return this.http.get<Student[]>(`${this.BASE_URL}/all`)
  }



}
