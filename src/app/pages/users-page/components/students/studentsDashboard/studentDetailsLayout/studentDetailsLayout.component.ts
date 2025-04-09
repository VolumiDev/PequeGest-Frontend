import { Component } from '@angular/core';
import { StudentDetailsSideMenuOptionsComponent } from "./studentDetailsSideMenuOptions/studentDetailsSideMenuOptions.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-details-layout',
  imports: [
    StudentDetailsSideMenuOptionsComponent,
    RouterOutlet
  ],
  templateUrl: './studentDetailsLayout.component.html',
})
export class StudentDetailsLayoutComponent { }
