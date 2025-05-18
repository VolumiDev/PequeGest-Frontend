import { Component } from '@angular/core';
import { OnConstructComponent } from '../../../shared/components/onConstruct/onConstruct.component';

@Component({
  selector: 'app-student',
  imports: [OnConstructComponent],
  templateUrl: './student.component.html',
})
export class StudentComponent {}
