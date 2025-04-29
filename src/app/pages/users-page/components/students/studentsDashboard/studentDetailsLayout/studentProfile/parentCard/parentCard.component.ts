import { Component, Input } from '@angular/core';
import { ParentFormComponent } from '../../../listAddStudents/parentForm/parentForm.component';
import { ParentDto } from '../../../../../../../../interfaces/ParentDto.interface';

@Component({
  selector: 'app-parent-card',
  imports: [ParentFormComponent],
  templateUrl: './parentCard.component.html',
})
export class ParentCardComponent {
  @Input() parent: ParentDto | null = null;
}
