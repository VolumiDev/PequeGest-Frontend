import { Component, computed, inject, Input } from '@angular/core';
import { MessageBubbleComponent } from '../messageBubble/messageBubble.component';
import { MessagesService } from '../../../services/messages/messages.service';
import { AuthService } from '../../../auth/services/Auth.service';

@Component({
  selector: 'app-message-box',
  imports: [MessageBubbleComponent],
  templateUrl: './messageBox.component.html',
})
export class MessageBoxComponent {
  private _msgService = inject(MessagesService);
  private _authService = inject(AuthService);

  allMsgs = this._msgService.messages;

  msgsToShow = computed(() => {
    const msgs = this.allMsgs();
    const picks = this._msgService.targetUsersHashes();
    const meHash = this._authService.user()?.hash;

    if (picks.length === 0) {
      return msgs;
    }
    const filtered = msgs.filter(
      (m) => picks.includes(m.senderHash) || m.senderHash === meHash
    );
    return filtered;
  });

  @Input() studentHash?: string;
}
