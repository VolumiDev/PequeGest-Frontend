import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentFormServiceService {
  private baseUrl = 'https://restcountries.com/v3.1';
  http = inject(HttpClient);

  private _region = ['Africa', 'Americas', 'Europe', 'Asia', 'Oceania'];

  get regions(): string[] {
    return [...this._region];
  }

  getCountriesByRegion(region: String): Observable<Country[]> {
    if (!region) return of([]);

    const url = `${this.baseUrl}/region/${region}/?fields=cca3,name,borders`;
    return this.http.get<Country[]>(url);
  }
}
