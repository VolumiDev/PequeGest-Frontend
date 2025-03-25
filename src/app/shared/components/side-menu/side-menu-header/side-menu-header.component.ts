import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/Auth.service';

@Component({
  selector: 'app-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SideMenuHeaderComponent {

  title1: string = "Peque"
  title2: string = "Gest"

  authService = inject(AuthService);

  
}
