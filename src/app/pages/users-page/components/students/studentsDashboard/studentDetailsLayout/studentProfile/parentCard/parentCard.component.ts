import { Component, Input } from '@angular/core';
import { ParentFormComponent } from '../../../listAddStudents/parentForm/parentForm.component';
import { ParentDto } from '../../../../../../../../interfaces/ParentDto.interface';
import { ParentCardFormComponent } from './parentCardForm/parentCardForm.component';

@Component({
  selector: 'app-parent-card',
  imports: [ParentCardFormComponent],
  templateUrl: './parentCard.component.html',
})
export class ParentCardComponent {
  @Input() parent: ParentDto | null = null;
}
