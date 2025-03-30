import { Component } from '@angular/core';
import { TopMenuComponent } from "./shared/top-menu/top-menu.component";
import { RouterOutlet } from '@angular/router';
import { StudentsDataDetailsComponent } from './components/students/studentsDataDetails/studentsDataDetails.component';

@Component({
  selector: 'app-users-page',
  imports: [
    TopMenuComponent,
    RouterOutlet,
  ],
  templateUrl: './users-page.component.html',
  
})
export class UsersPageComponent { }
