import { UserConversation } from './../../../interfaces/UserConversation.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageBoxComponent } from '../../../shared/components/messageBox/messageBox.component';
import { InputChatMessageComponent } from '../../../shared/components/inputChatMessage/inputChatMessage.component';
import { UserToAdminMessagesServiceService } from '../../../services/messages/userToAdminMessagesService.service';
import { KeyValue } from '@angular/common';
import { ConversationViewComponent } from '../../../shared/components/conversationView/conversationView.component';
import { ConversationService } from '../../../services/messages/conversationService.service';
import { MessagesService } from '../../../services/messages/messages.service';
import { InputUserMessageComponent } from '../../../shared/components/inputUserMessage/inputUserMessage.component';

@Component({
  selector: 'app-messages',
  imports: [ConversationViewComponent, InputUserMessageComponent],
  templateUrl: './messages.component.html',
})
export class MessagesComponent implements OnInit {
  ngOnInit(): void {
    this.msgService.getUserConversations();
  }

  private convService = inject(ConversationService);

  private messageService = inject(UserToAdminMessagesServiceService);
  get msgService(): UserToAdminMessagesServiceService {
    return this.messageService;
  }

  get conversationsEntries(): KeyValue<string, UserConversation>[] {
    const map = this.msgService.conversations() ?? {};
    const entries = Object.entries(map).map(
      ([key, value]) => ({ key, value } as KeyValue<string, UserConversation>)
    );
    entries.forEach((conv) => {
      conv.value.receivedMessages.forEach(
        (msg) => (msg.send_date = new Date(msg.send_date!))
      );
    });
    return entries;
  }

  setConversation(conv: UserConversation) {
    this.convService.setUserTarget(conv.alter.hash);
    this.convService.setConvSelected(conv);
  }
}
