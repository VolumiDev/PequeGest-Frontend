import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutesServices {

  paramHash = signal<String | null>(null);

}
