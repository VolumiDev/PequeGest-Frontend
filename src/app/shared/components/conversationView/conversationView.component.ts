import { Component, inject } from '@angular/core';

import { ConversationService } from '../../../services/messages/conversationService.service';
import { MessageBubbleComponent } from '../messageBubble/messageBubble.component';

@Component({
  selector: 'app-conversation-view',
  imports: [MessageBubbleComponent],
  templateUrl: './conversationView.component.html',
})
export class ConversationViewComponent {
  private convService = inject(ConversationService);

  messageToShow = this.convService.showMessages;
}
