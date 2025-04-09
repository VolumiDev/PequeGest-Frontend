import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-student-profile',
  imports: [],
  templateUrl: './studentProfile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileComponent { }
