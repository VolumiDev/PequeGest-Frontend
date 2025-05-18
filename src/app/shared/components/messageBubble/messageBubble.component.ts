import { Component, inject, Input } from '@angular/core';
import { MessageDto } from '../../../interfaces/MessageDto.interface';
import { DatePipe, JsonPipe } from '@angular/common';
import { AuthService } from '../../../auth/services/Auth.service';
import { environment } from '../../../../environment/enviroment';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe, JsonPipe],
  templateUrl: './messageBubble.component.html',
})
export class MessageBubbleComponent {
  readonly baseurl: string = environment.baseUrl;

  @Input() studentHash?: string;

  private authService = inject(AuthService);

  isOwnMessage() {
    if (this.msg?.senderHash === this.authService.user()?.hash) {
      return true;
    } else {
      return false;
    }
  }
  @Input() msg?: MessageDto;
}
