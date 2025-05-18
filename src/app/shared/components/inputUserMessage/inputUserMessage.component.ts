import { Component, inject } from '@angular/core';
import { ConversationService } from '../../../services/messages/conversationService.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/FormUtils';

@Component({
  selector: 'app-input-user-message',
  imports: [ReactiveFormsModule],
  templateUrl: './inputUserMessage.component.html',
})
export class InputUserMessageComponent {
  private msgService = inject(ConversationService);
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  msgForm = this.fb.group({
    messageContent: ['', [Validators.required]],
  });

  onSendMsg() {
    if (this.msgForm.invalid) {
      this.msgForm.markAllAsTouched();
      return;
    }
    this.msgService.sendMsg(this.msgForm.controls['messageContent'].value!);
    this.msgForm.reset;
  }
}
