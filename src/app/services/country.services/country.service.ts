import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, WritableSignal } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Country } from '../../pages/users-page/interfaces/country.interface';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
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

  onRegionChange(
    form: FormGroup,
    countriesByRegion: WritableSignal<Country[]>
  ) {
    return form
      .get('region')!
      .valueChanges.pipe(
        tap(() => form.get('country')?.setValue('')),
        tap(() => {
          countriesByRegion.set([]);
        }),
        switchMap((region) => this.getCountriesByRegion(region ?? ''))
      )
      .subscribe((countries) => {
        countriesByRegion.set(countries);
      });
  }
}
