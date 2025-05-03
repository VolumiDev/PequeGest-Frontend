import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/enviroment';
import { ParentDto } from '../../interfaces/ParentDto.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_URL = `${environment.baseUrl}/api/user`;
  private http = inject(HttpClient);

  updateParentData(parent: ParentDto): Observable<ParentDto | null> {
    if (null == parent.hash) {
      return of(null);
    }
    return this.http.put<ParentDto | null>(
      `${this.BASE_URL}/update/parent/${parent.hash}`,
      parent
    );
  }
}
