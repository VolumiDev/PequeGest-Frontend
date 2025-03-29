import { Component } from '@angular/core';
import { TopMenuComponent } from "./shared/top-menu/top-menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-users-page',
  imports: [
    TopMenuComponent,
    RouterOutlet,
  ],
  templateUrl: './users-page.component.html',
  
})
export class UsersPageComponent { }
