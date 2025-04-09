import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-student-chat',
  imports: [],
  templateUrl: './studentChat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentChatComponent { }
