import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/FormUtils';

@Component({
  selector: 'app-input-chat-message',
  imports: [ReactiveFormsModule],
  templateUrl: './inputChatMessage.component.html',
})
export class InputChatMessageComponent implements OnInit {
  ngOnInit(): void {
    this.msgService.setMsgForm(this.msgForm);
  }
  private msgService = inject(MessagesService);
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  msgForm = this.fb.group(
    {
      messageContent: ['', [Validators.required]],
    },
    {
      validators: this.formUtils.targetUsersValidator(() =>
        this.msgService.targetUsersHashes()
      ),
    }
  );

  onSendMsg() {
    if (this.msgForm.invalid) {
      this.msgForm.markAllAsTouched();
      return;
    }
    this.msgService.sendMessage(this.msgForm.controls['messageContent'].value!);
    this.msgForm.reset;
  }
}
