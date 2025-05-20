import { StudentDto } from './../../../interfaces/StudentDto.interface';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserUIStudentServiceService } from '../../../services/userUIStudentService.service';
import { AuthService } from '../../../auth/services/Auth.service';
import { tap } from 'rxjs';
import { OnConstructComponent } from '../../../shared/components/onConstruct/onConstruct.component';
import { CommonModule } from '@angular/common';
import { UserUIStudentCardComponent } from './userUIStudentCard/userUIStudentCard.component';
import { environment } from '../../../../environment/enviroment';

@Component({
  selector: 'app-student',
  imports: [CommonModule, UserUIStudentCardComponent],
  templateUrl: './student.component.html',
})
export class StudentComponent implements OnInit {
  selectedStudent = signal<StudentDto | null>(null);

  readonly BASE_URL = environment.baseUrl;

  private authService = inject(AuthService);
  private uiStudentService = inject(UserUIStudentServiceService);

  private _students = signal<StudentDto[]>([]);
  students = computed(() => this._students());
  ngOnInit(): void {
    this.getStudents();
  }

  selectStudent(student: StudentDto) {
    this.selectedStudent.update((curent) => student);
  }

  getStudents() {
    if (!this.authService.user()?.hash) {
      console.log(`No hay un hash almacenado en authService`);
      return;
    }

    this.uiStudentService
      .getStudentsByParentHash(this.authService.user()?.hash!)
      .pipe(
        tap((students) => this._students.update((current) => students)),
        tap(() => console.log('panel de students', this.students()))
      )
      .subscribe();
  }

  getAge(birthdate: Date): number {
    const today = new Date();
    const bday = new Date(birthdate);
    let age = today.getFullYear() - bday.getFullYear();
    const m = today.getMonth() - bday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) {
      age--;
    }
    return age;
  }
}
