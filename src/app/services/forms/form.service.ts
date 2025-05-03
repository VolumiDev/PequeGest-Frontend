import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  wasAccept = signal<boolean>(false);

  isPristine = signal<boolean>(false);
}
